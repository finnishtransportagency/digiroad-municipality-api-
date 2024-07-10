import axios from 'axios';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import { offline, offlineApiKey, bbox, fetchSize, stage } from '@functions/config';
import { isScheduleEvent, isXmlFeatureCollectionJson } from './types';
import { middyfy } from '@libs/lambda-tools';
import { getParameter } from '@libs/ssm-tools';
import { uploadToS3 } from '@libs/s3-tools';

const mergeData = (dataArray: Array<string>): string => {
  if (dataArray.length === 0) throw new Error('No data to merge');
  if (dataArray.length === 1) return dataArray[0];

  const parser = new XMLParser();
  const jsonArray = dataArray.map((data) => {
    const parsed = parser.parse(data) as unknown;
    if (!isXmlFeatureCollectionJson(parsed)) {
      throw new Error('Invalid XML data');
    }
    return parsed;
  });

  // Using the first xmlFeatureCollectionJson as a base and pushing the rest of the data into it
  const result = jsonArray.slice(1).reduce(
    (acc, curr) => {
      acc['sf:FeatureCollection']['sf:featureMember'].push(
        ...curr['sf:FeatureCollection']['sf:featureMember']
      );
      return acc;
    },
    { ...jsonArray[0] }
  );

  const builder = new XMLBuilder({});
  const xmlResult = builder.build(result) as unknown;
  if (typeof xmlResult !== 'string') throw new Error('Failed to build XML');
  return xmlResult;
};

const fetchMunicipalityData = async (event: unknown) => {
  if (!isScheduleEvent(event)) {
    throw new Error('Invalid event');
  }

  const apiKey = offline
    ? offlineApiKey
    : await getParameter(
        `/DRKunta/${stage}/${event.municipality}`
      );

  for (var assetType of Object.entries(event.assetTypes)) {
    let offset = 0;
    const dataArray: Array<string> = [];
    while (true) {
      const url =
        event.url +
        `/collections/${
          assetType[1]
        }/items?f=gml&crs=http://www.opengis.net/def/crs/EPSG/0/3067&limit=${fetchSize}&offset=${
          offset * fetchSize
        }${bbox}`;

      const { data }: { data: unknown } = await axios.get(url, {
        headers: {
          Authorization: apiKey
        }
      });

      if (typeof data !== 'string' || !data.includes('sf:featureMember')) break;

      dataArray.push(data);
      offset += 1;
    }

    const payload = mergeData(dataArray);

    const now = new Date().toISOString().slice(0, 19);

    await uploadToS3(
      `dr-kunta-${stage}-bucket-placeholder`,
      `infrao/${event.municipality}/${assetType[0]}/${now}.xml`,
      payload
    );
  }
};

export const main = middyfy(fetchMunicipalityData);
