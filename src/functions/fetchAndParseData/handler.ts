import {
  AssetTypeString,
  isAssetTypeKey,
  isScheduleEvent
} from '@customTypes/eventTypes';
import {
  AdditionalPanelParseObject,
  Feature,
  FeatureCollection,
  InvalidFeature,
  ValidFeature
} from '@customTypes/featureTypes';
import {
  fetchSize,
  offline,
  offlineApiKey,
  stage,
  bbox,
  bucketName,
  helsinkiBbox,
  serviceName
} from '@functions/config';
import { middyfy } from '@libs/lambda-tools';
import { now, uploadToS3 } from '@libs/s3-tools';
import { getParameter } from '@libs/ssm-tools';
import { infraoJsonSchema, helsinkiJsonSchema } from '@schemas/muniResponseSchema';
import axios from 'axios';
import parseFeature from './parseFeature';
import matchAdditionalPanels from './matchAdditionalPanels';
import { SignMap } from '@customTypes/mapTypes';
import helsinkiSignMapParser from './parseFeature/helsinki/helsinkiSignMapParser';
import { additionalPanelFeatureSchema } from '@schemas/geoJsonSchema';
import helsinkiSignParser from './parseFeature/helsinki/helsinkiSignParser';
import { invalidFeature } from '@libs/schema-tools';
import { initializeFeatureCollection } from '@libs/spatial-tools';

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
    : await getParameter(`/${serviceName}/${stage}/${event.municipality}/apiKey`);

  for (const assetKey of assetTypeKeys) {
    switch (event.format) {
      case 'json': {
        const geoJson: [FeatureCollection, FeatureCollection] = await fetchJsonData(
          event.assetTypes[assetKey],
          event.municipality,
          event.url,
          apiKey
        );
        await uploadToS3(
          bucketName,
          `geojson/${event.municipality}/${assetKey}/${now()}.json`,
          JSON.stringify(geoJson[0])
        );
        await uploadToS3(
          bucketName,
          `invalidInfrao/${event.municipality}/${assetKey}/${now()}.json`,
          JSON.stringify(geoJson[1])
        );
        break;
      }

      case 'gml':
      case 'xml': {
        const dataArray: Array<string> = await fetchXmlData(
          event.assetTypes[assetKey],
          event.url,
          apiKey
        );
        console.log('XML dataArray:', dataArray);
        // TODO: Parse XML data
        // TODO: Save GeoJSON to S3
        console.warn(`${event.format} parsing not yet implemented`);
        break;
      }
      case 'helsinki': {
        const geoJson = await fetchHelsinkiData(
          event.assetTypes[assetKey],
          event.municipality,
          event.url
        );
        await uploadToS3(
          bucketName,
          `geojson/helsinki/${assetKey}/${new Date()
            .toISOString()
            .slice(0, 19)
            .replaceAll(':', '_')}.json`,
          JSON.stringify(geoJson[0])
        );
        await uploadToS3(
          bucketName,
          `invalidInfrao/helsinki/${assetKey}/${new Date()
            .toISOString()
            .slice(0, 19)
            .replaceAll(':', '_')}.json`,
          JSON.stringify(geoJson[1])
        );
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
): Promise<[FeatureCollection, FeatureCollection]> => {
  let page = 0;
  const geoJson = initializeFeatureCollection(municipality, assetType, 'geoJson');

  const invalidInfrao = initializeFeatureCollection(
    municipality,
    assetType,
    'invalidInfrao'
  );

  while (true) {
    console.info('Fetching page:', page);
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

    const validFeatures = parsedFeatures.filter(
      (f): f is ValidFeature => f.type === 'Feature'
    );
    const invalidFeatures = parsedFeatures.filter(
      (f): f is InvalidFeature => f.type === 'Invalid'
    );

    geoJson.features.push(...validFeatures);
    invalidInfrao.features.push(...invalidFeatures);

    if (infraoFeatureCollection.numberReturned < fetchSize) break;
    page++;
  }

  if (assetType === 'infrao:Liikennemerkki') {
    const matchedPanels = matchAdditionalPanels(geoJson.features);
    geoJson.features = matchedPanels;
  }

  return [geoJson, invalidInfrao];
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

const fetchAdditionalPanelsHelsinki = async (
  baseUrl: string
): Promise<AdditionalPanelParseObject> => {
  let page = 0;
  const signMap: Array<SignMap> = await fetchSignMap(baseUrl, 'additional_sign');
  const additionalPanelsParseObject: AdditionalPanelParseObject = {
    additionalPanels: {},
    rejected: []
  };
  while (true) {
    console.log('Fetching additional panels, page:', page);
    const { data }: { data: unknown } = await axios.get(
      `${baseUrl}/additional-sign-reals/?geo_format=geojson&limit=${fetchSize}&offset=${
        page * fetchSize
      }${helsinkiBbox}`
    );
    const helsinkiFeatureCollection = helsinkiJsonSchema.validateSync(data);
    const parsedPanels =
      helsinkiFeatureCollection.results.reduce<AdditionalPanelParseObject>(
        (acc, value): AdditionalPanelParseObject => {
          const { parent } = value as { parent: unknown };
          if (!parent || typeof parent !== 'string')
            return {
              additionalPanels: acc.additionalPanels,
              rejected: [
                ...acc.rejected,
                invalidFeature(value, 'Additionalpanel missing parent field')
              ]
            };
          const parsedFeature = (() => {
            try {
              return helsinkiSignParser(value, signMap, true);
            } catch (error) {
              return invalidFeature(
                value,
                `Parser error: ${error instanceof Error ? error.message : String(error)}`
              );
            }
          })();
          if (!additionalPanelFeatureSchema.isValidSync(parsedFeature))
            return {
              additionalPanels: acc.additionalPanels,
              rejected: [
                ...acc.rejected,
                parsedFeature.type === 'Invalid'
                  ? parsedFeature
                  : invalidFeature(value, 'Feature is not valid additional panel')
              ]
            };

          return {
            additionalPanels: {
              ...acc.additionalPanels,
              [parent]: [
                ...(acc.additionalPanels[parent] ?? []),
                parsedFeature.properties
              ]
            },
            rejected: acc.rejected
          };
        },
        {
          additionalPanels: {},
          rejected: []
        } as AdditionalPanelParseObject
      );
    additionalPanelsParseObject.additionalPanels = Object.entries(
      parsedPanels.additionalPanels
    ).reduce(
      (acc, [key, value]) => {
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key] = [...acc[key], ...value];
        return acc;
      },
      { ...additionalPanelsParseObject.additionalPanels }
    );
    additionalPanelsParseObject.rejected.push(...parsedPanels.rejected);
    if (!helsinkiFeatureCollection.next) break;
    page++;
  }
  return additionalPanelsParseObject;
};

const fetchSignMap = async (
  baseUrl: string,
  fetchType: string
): Promise<Array<SignMap>> => {
  const response = await axios.get(
    `${baseUrl}/traffic-control-device-types/?target_model=${fetchType}&limit=700`
  );
  const typeData = response.data as unknown;
  const signMap = helsinkiJsonSchema.validateSync(typeData);
  return signMap.results.map((feature) => helsinkiSignMapParser(feature));
};

const fetchHelsinkiData = async (
  assetType: AssetTypeString,
  municipality: string,
  baseUrl: string
): Promise<[FeatureCollection, FeatureCollection]> => {
  let page = 0;
  const geoJson = initializeFeatureCollection(municipality, assetType, 'geoJson');
  const invalidInfrao = initializeFeatureCollection(
    municipality,
    assetType,
    'invalidInfrao'
  );
  const isTrafficSign = assetType === 'traffic-sign-reals';
  const parsedSignMap = isTrafficSign
    ? await fetchSignMap(baseUrl, 'traffic_sign')
    : undefined;
  const additionalPanels = isTrafficSign
    ? await fetchAdditionalPanelsHelsinki(baseUrl)
    : undefined;
  while (true) {
    console.info('Fetching page:', page);
    const { data }: { data: unknown } = await axios.get(
      `${baseUrl}/${assetType as string}/?geo_format=geojson&limit=${fetchSize}&offset=${
        page * fetchSize
      }${helsinkiBbox}`
    );
    const helsinkiFeatureCollection = helsinkiJsonSchema.validateSync(data);
    const parsedFeatures: Array<Feature> = helsinkiFeatureCollection.results.map(
      (feature) =>
        parseFeature(
          assetType,
          feature,
          parsedSignMap,
          additionalPanels?.additionalPanels
        )
    );
    const validFeatures = parsedFeatures.filter(
      (f): f is ValidFeature => f.type === 'Feature'
    );
    const invalidFeatures = parsedFeatures.filter(
      (f): f is InvalidFeature => f.type === 'Invalid'
    );

    geoJson.features.push(...validFeatures);
    invalidInfrao.features.push(...invalidFeatures);

    if (!helsinkiFeatureCollection.next) break;
    page++;
  }

  return [geoJson, invalidInfrao];
};

export const main = middyfy(fetchAndParseData);
