import {
  AssetTypeString,
  isAssetTypeKey,
  isScheduleEvent
} from '@customTypes/eventTypes';
import {
  fetchSize,
  offline,
  offlineApiKey,
  stage,
  bbox
} from '@functions/config';
import { middyfy } from '@libs/lambda-tools';
import { uploadToS3 } from '@libs/s3-tools';
import { getParameter } from '@libs/ssm-tools';
import {
  Feature,
  FeatureCollection,
  ValidFeature
} from '@schemas/geoJsonSchema';
import {
  infraoJsonSchema,
  infraoObstacleSchema,
  infraoTrafficSignSchema
} from '@schemas/muniResponseSchema';
import { oldTrafficSignMapping } from '@schemas/trafficSignMapping';
import { trafficSignsWithTextValue } from '@schemas/trafficSignTypes';
import axios from 'axios';

const parseFeature = (
  assetType: AssetTypeString,
  feature: unknown
): Feature => {
  switch (assetType) {
    case 'infrao:Rakenne': {
      const castedFeature = infraoObstacleSchema.cast(feature);
      const properties = castedFeature.properties;
      const id = properties.yksilointitieto;
      const coordinates = castedFeature.geometry.coordinates;

      if (!infraoObstacleSchema.isValidSync(castedFeature))
        return {
          type: 'Invalid',
          id: id,
          properties: {
            reason: 'Does not match infraoObstacleSchema',
            feature: JSON.stringify(feature)
          }
        };

      return {
        type: 'Feature',
        id: castedFeature.id,
        properties: {
          TYPE: 'OBSTACLE',
          ID: String(id),
          EST_TYYPPI: properties.malli === 'Pollari' ? 1 : 2
        },
        geometry: {
          type: 'Point',
          coordinates: [coordinates[0], coordinates[1]]
        }
      };
    }

    case 'infrao:Liikennemerkki': {
      const castedFeature = infraoTrafficSignSchema.cast(feature);
      const properties = castedFeature.properties;
      const id = properties.yksilointitieto;
      const coordinates = castedFeature.geometry.coordinates;

      if (!infraoTrafficSignSchema.isValidSync(castedFeature))
        return {
          type: 'Invalid',
          id: id,
          properties: {
            reason: 'Does not match infraoTrafficSignSchema',
            feature: JSON.stringify(feature)
          }
        };

      // Clean this mess pls!!!
      // v------------------ MESS ------------------v //
      if (
        !properties.liikennemerkkityyppi2020 ||
        properties.liikennemerkkityyppi2020 === 'ei tiedossa'
      ) {
        properties.liikennemerkkityyppi2020 = oldTrafficSignMapping[
          properties.liikennemerkkityyppi as keyof typeof oldTrafficSignMapping
        ] as string;
      }
      if (!properties.liikennemerkkityyppi2020) {
        return {
          type: 'Invalid',
          id: id,
          properties: {
            reason: 'Invalid liikennemerkkityyppi2020',
            feature: JSON.stringify(feature)
          }
        };
      }
      // ^------------------------------------------^ //

      return {
        type: 'Feature',
        id: castedFeature.id,
        properties: {
          TYPE:
            properties.liikennemerkkityyppi2020[0] === 'H'
              ? 'ADDITIONALPANEL'
              : 'TRAFFICSIGN',
          ID: String(id),
          SUUNTIMA: properties.suunta ? properties.suunta * (180 / Math.PI) : 0,
          LM_TYYPPI: properties.liikennemerkkityyppi2020,
          ARVO: trafficSignsWithTextValue.includes(
            properties.liikennemerkkityyppi2020
          )
            ? Number(properties.teksti)
            : null,
          TEKSTI: properties.teksti,
          ...(!(properties.liikennemerkkityyppi2020[0] === 'H') && {
            LISAKILVET: []
          })
        },
        geometry: {
          type: 'Point',
          coordinates: [coordinates[0], coordinates[1]]
        }
      };
    }

    case 'infrao:KatualueenOsa':
      //TODO: Implement
      console.warn(`${assetType} not yet implemented in parseFeature`);
      break;

    default:
      console.warn('Asset type not supported by parseFeature:', assetType);
  }
  return {
    type: 'Invalid',
    id: -1,
    properties: {
      reason: `Asset type not supported by parseFeature: ${
        assetType ?? 'undefined/null'
      }`,
      feature: JSON.stringify(feature)
    }
  };
};

const getDistance = (
  additionalPanelCoords: Array<number>,
  mainPanelCoords: Array<number>
): number => {
  const dx = additionalPanelCoords[0] - mainPanelCoords[0];
  const dy = additionalPanelCoords[1] - mainPanelCoords[1];
  return Math.sqrt(dx * dx + dy * dy);
};

const similarBearing = (
  additionalPanelBearing: number,
  mainPanelBearing: number
): boolean => {
  const diff = Math.abs(additionalPanelBearing - mainPanelBearing);
  return diff <= 45 || diff >= 315;
};

const matchAdditionalPanels = (
  features: Array<Feature>
): Array<ValidFeature> => {
  const validFeatures = features.filter(
    (f) => f.type === 'Feature'
  ) as Array<ValidFeature>;
  const additionalPanels = validFeatures.filter(
    (f) => f.properties.TYPE === 'ADDITIONALPANEL'
  );
  const mainPanels = validFeatures.filter(
    (f) => f.properties.TYPE !== 'ADDITIONALPANEL'
  );
  const rejectedAdditionalPanels: Array<Feature> = [];
  for (const additionalPanel of additionalPanels) {
    let matched = false;
    for (const mainPanel of mainPanels) {
      const distance = getDistance(
        additionalPanel.geometry.coordinates,
        mainPanel.geometry.coordinates
      );
      if (
        'SUUNTIMA' in additionalPanel.properties &&
        'SUUNTIMA' in mainPanel.properties
      ) {
        if (
          distance <= 2 &&
          similarBearing(
            additionalPanel.properties.SUUNTIMA,
            mainPanel.properties.SUUNTIMA
          )
        ) {
          if ('LISAKILVET' in mainPanel.properties) {
            mainPanel.properties.LISAKILVET.push(additionalPanel.properties);
            matched = true;
            break;
          }
        }
      }
    }
    if (!matched) {
      rejectedAdditionalPanels.push(additionalPanel);
    }
  }
  for (const mainPanel of mainPanels) {
    if (
      'LISAKILVET' in mainPanel.properties &&
      mainPanel.properties.LISAKILVET.length > 0
    ) {
      console.log(mainPanel.properties.LISAKILVET);
    }
  }
  console.log(additionalPanels.length);
  /* console.log(rejectedAdditionalPanels); */

  return mainPanels;
};

const fetchAndParseData = async (event: unknown) => {
  if (!isScheduleEvent(event)) {
    throw new Error('Invalid event');
  }

  const assetTypeKeys = Object.keys(event.assetTypes).filter(isAssetTypeKey);
  if (assetTypeKeys.length === 0) {
    throw new Error('No valid asset types provided');
  }

  const apiKey = offline
    ? offlineApiKey
    : await getParameter(`/DRKunta/${stage}/${event.municipality}`);

  for (const assetKey of assetTypeKeys) {
    switch (event.format) {
      case 'json': {
        const geoJson: FeatureCollection = await fetchJsonData(
          event.assetTypes[assetKey],
          event.municipality,
          event.url,
          apiKey
        );
        await uploadToS3(
          `dr-kunta-${stage}-bucket`,
          `geojson/${event.municipality}/${assetKey}/${new Date()
            .toISOString()
            .slice(0, 19)}.json`,
          JSON.stringify(geoJson)
        );
        break;
      }

      case 'gml' || 'xml': {
        const dataArray: Array<string> = await fetchXmlData(
          event.assetTypes[assetKey],
          event.url,
          apiKey
        );
        console.log('XML dataArray:', dataArray);
        // TODO: Parse XML data
        // TODO: Save GeoJSON to S3
        console.log(`${event.format} parsing not yet implemented`);
        break;
      }

      default:
        console.warn(
          'API response type not supported by fetchAndParseData:',
          event.format
        );
        break;
    }
  }
};

const fetchJsonData = async (
  assetType: AssetTypeString,
  municipality: string,
  baseUrl: string,
  apiKey: string
): Promise<FeatureCollection> => {
  let page = 0;
  const geoJson: FeatureCollection = {
    type: 'FeatureCollection',
    name: `${municipality}-Kuntarajapinta`,
    crs: {
      type: 'name',
      properties: {
        name: 'urn:ogc:def:crs:EPSG::3067'
      }
    },
    features: [],
    invalidInfrao: {
      sum: 0,
      IDs: []
    }
  };

  while (true) {
    const { data }: { data: unknown } = await axios.get(
      `${baseUrl}/collections/${
        assetType as string
      }/items?f=json&crs=http://www.opengis.net/def/crs/EPSG/0/3067&limit=${fetchSize}&offset=${
        page * fetchSize
      }${bbox}`,
      {
        headers: {
          Authorization: apiKey
        }
      }
    );
    const infraoFeatureCollection = infraoJsonSchema.validateSync(data);
    const parsedFeatures: Array<Feature> = infraoFeatureCollection.features.map(
      (feature) => parseFeature(assetType, feature)
    );

    const validFeatures =
      assetType === 'infrao:Liikennemerkki'
        ? matchAdditionalPanels(parsedFeatures)
        : parsedFeatures.filter((f) => f.type === 'Feature');
    const invalidFeatures = parsedFeatures.filter((f) => f.type === 'Invalid');

    geoJson.features.push(...validFeatures);
    geoJson.invalidInfrao.sum += invalidFeatures.length;
    geoJson.invalidInfrao.IDs.push(...invalidFeatures.map((f) => Number(f.id)));

    if (infraoFeatureCollection.numberReturned < fetchSize) break;
    page++;
  }

  return geoJson;
};

const fetchXmlData = async (
  assetType: AssetTypeString,
  baseUrl: string,
  apiKey: string
): Promise<Array<string>> => {
  let page = 0;
  const dataArray: Array<string> = [];

  while (true) {
    const { data }: { data: unknown } = await axios.get(
      `${baseUrl}/collections/${
        assetType as string
      }/items?f=xml&crs=http://www.opengis.net/def/crs/EPSG/0/3067&limit=${fetchSize}&offset=${
        page * fetchSize
      }${bbox}`,
      {
        headers: {
          Authorization: apiKey
        }
      }
    );
    if (typeof data !== 'string' || !data.includes('sf:featureMember')) break;
    dataArray.push(data);
    page++;
  }
  return dataArray;
};

export const main = middyfy(fetchAndParseData);
