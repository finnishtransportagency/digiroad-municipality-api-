import {
  AssetType,
  isAssetType,
  isScheduleEvent
} from '@customTypes/eventTypes';
import {
  fetchSize,
  offline,
  offlineApiKey,
  stage,
  testBbox
} from '@functions/config';
import { middyfy } from '@libs/lambda-tools';
import { getParameter } from '@libs/ssm-tools';
import { Feature, FeatureCollection } from '@schemas/geoJsonSchema';
import { infraoJsonSchema } from '@schemas/muniResponseSchema';
import axios from 'axios';

const parseFeature = (assetType: AssetType, feature: unknown): Feature => {
  switch (assetType) {
    case 'infrao:Rakenne':
      //TODO: Implement
      console.warn(`${assetType} not yet implemented in parseFeature`);
      break;

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
      break;
  }
  return {
    type: 'Invalid',
    id: 'Default_return',
    properties: JSON.stringify(feature)
  };
};

const fetchAndParseData = async (event: unknown) => {
  if (!isScheduleEvent(event)) {
    throw new Error('Invalid event');
  }

  const assetTypes = Object.entries(event.assetTypes)
    .map((t) => t[1] as unknown)
    .filter(isAssetType);
  if (assetTypes.length === 0) {
    throw new Error('No valid asset types provided');
  }

  const apiKey = offline
    ? offlineApiKey
    : await getParameter(`/DRKunta/${stage}/${event.municipality}`);

  for (const assetType of assetTypes) {
    switch (event.format) {
      case 'json': {
        const geoJson = await fetchJsonData(
          assetType,
          event.municipality,
          event.url,
          apiKey
        );
        console.log('GeoJSON:', geoJson);
        // TODO: Save GeoJSON to S3
        break;
      }

      case 'gml' || 'xml': {
        const dataArray = await fetchXmlData(assetType, event.url, apiKey);
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
  assetType: AssetType,
  municipality: string,
  baseUrl: string,
  apiKey: string
): Promise<FeatureCollection> => {
  let page = 0;
  const bbox = offline
    ? `&bbox=${testBbox}&bbox-crs=http://www.opengis.net/def/crs/EPSG/0/3067`
    : '';
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
    const parsedFeatures = infraoFeatureCollection.features.map((feature) =>
      parseFeature(assetType, feature)
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
  assetType: AssetType,
  baseUrl: string,
  apiKey: string
): Promise<Array<string>> => {
  let page = 0;
  const bbox = offline
    ? `&bbox=${testBbox}&bbox-crs=http://www.opengis.net/def/crs/EPSG/0/3067`
    : '';
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
