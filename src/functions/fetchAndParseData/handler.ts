import {
  AssetTypeString,
  isAssetTypeString,
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
import { Feature, FeatureCollection } from '@schemas/geoJsonSchema';
import {
  infraoJsonSchema,
  infraoObstacleSchema
} from '@schemas/muniResponseSchema';
import axios from 'axios';

const parseFeature = (
  assetType: AssetTypeString,
  feature: unknown
): Feature => {
  switch (assetType) {
    case 'infrao:Rakenne': {
      const castedFeature = infraoObstacleSchema.cast(feature);
      const id = castedFeature.id;
      const properties = castedFeature.properties;
      const coordinates = castedFeature.geometry.coordinates;

      if (!infraoObstacleSchema.isValidSync(castedFeature))
        return {
          type: 'Invalid',
          id: id,
          properties: JSON.stringify(feature)
        };

      return {
        type: 'Feature',
        id: id,
        properties: {
          TYPE: 'OBSTACLE',
          ID: properties.yksilointitieto,
          EST_TYYPPI: properties.malli === 'Puomi' ? 2 : 1
        },
        geometry: {
          type: 'Point',
          coordinates: [coordinates[0], coordinates[1]]
        }
      };
    }

    case 'infrao:Liikennemerkki':
      //TODO: Implement
      console.warn(`${assetType} not yet implemented in parseFeature`);
      break;

    case 'infrao:KatualueenOsa':
      //TODO: Implement
      console.warn(`${assetType} not yet implemented in parseFeature`);
      break;

    default:
      console.warn('Asset type not supported by parseFeature:', assetType);
  }
  return {
    type: 'Invalid',
    id: `Asset type not supported by parseFeature: ${assetType}`,
    properties: JSON.stringify(feature)
  };
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
        console.log('GeoJSON:', geoJson);
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
      `${baseUrl}/collections/${assetType}/items?f=json&crs=http://www.opengis.net/def/crs/EPSG/0/3067&limit=${fetchSize}&offset=${
        page * fetchSize
      }${bbox}`,
      {
        headers: {
          Authorization: apiKey
        }
      }
    );
    const infraoFeatureCollection = await infraoJsonSchema.validate(data);
    const parsedFeatures: Array<Feature> = infraoFeatureCollection.features.map(
      (feature) => parseFeature(assetType, feature)
    );
    const validFeatures = parsedFeatures.filter((f) => f.type === 'Feature');
    const invalidFeatures = parsedFeatures.filter((f) => f.type === 'Invalid');

    geoJson.features.push(...validFeatures);
    geoJson.invalidInfrao.sum += invalidFeatures.length;
    geoJson.invalidInfrao.IDs.push(...invalidFeatures.map((f) => f.id));

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
      `${baseUrl}/collections/${assetType}/items?f=xml&crs=http://www.opengis.net/def/crs/EPSG/0/3067&limit=${fetchSize}&offset=${
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
