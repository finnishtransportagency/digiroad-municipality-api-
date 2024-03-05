import { middyfy } from '@libs/lambda';
import { SSM, GetParameterCommand } from '@aws-sdk/client-ssm';
import { PutObjectCommandInput, S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import axios from 'axios';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import { offline, apikey, testBbox } from '@functions/config';
import { isScheduleEvent, isXmlFeatureCollectionJson } from './types';

const s3 = new S3(
  offline
    ? {
        forcePathStyle: true,
        credentials: {
          accessKeyId: 'S3RVER', // This specific key is required when working offline
          secretAccessKey: 'S3RVER'
        },
        endpoint: 'http://localhost:4569'
      }
    : {}
);

const getParameter = async (name: string): Promise<string> => {
  const ssm = new SSM({});
  const getParametersCommand = new GetParameterCommand({
    Name: name,
    WithDecryption: true
  });
  const result = await ssm.send(getParametersCommand);
  return result.Parameter.Value;
};

const mergeData = (dataArray: Array<string>): string => {
  if (dataArray.length === 0) throw new Error('No data to merge');
  if (dataArray.length === 1) return dataArray[0];

  const parser = new XMLParser();
  const jsonArray = dataArray.map((data) => {
    const parsed = parser.parse(data);
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
  const xmlResult = builder.build(result);
  return xmlResult;
};

const fetchMunicipalityData = async (event: unknown) => {
  if (!isScheduleEvent(event)) {
    throw new Error('Invalid event');
  }

  const apiKey = offline
    ? apikey
    : await getParameter(
        `/DRKunta/${process.env.STAGE_NAME}/${event.municipality}`
      );

  for (var assetType of Object.entries(event.assetTypes)) {
    const fetchSize = 5000;
    let offset = 0;
    const bbox = offline
      ? `&bbox=${testBbox}&bbox-crs=http://www.opengis.net/def/crs/EPSG/0/3067`
      : '';
    const dataArray: Array<string> = [];
    while (true) {
      const url =
        event.url +
        `/collections/${
          assetType[1]
        }/items?f=gml&crs=http://www.opengis.net/def/crs/EPSG/0/3067&limit=${fetchSize}&offset=${
          offset * fetchSize
        }${bbox}`;

      const { data } = await axios.get(url, {
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

    const putParams: PutObjectCommandInput = {
      Bucket: `dr-kunta-${process.env.STAGE_NAME}-bucket`,
      Key: `infrao/${event.municipality}/${assetType[0]}/${now}.xml`,
      Body: payload
    };

    await new Upload({
      client: s3,
      params: putParams
    }).done();
  }
};

export const main = middyfy(fetchMunicipalityData);
