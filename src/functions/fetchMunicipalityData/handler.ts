import { middyfy } from '@libs/lambda';
import { SSM, GetParameterCommand } from '@aws-sdk/client-ssm';
import { S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import axios from 'axios';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import { offline, apikey } from '@functions/config';

const s3config = offline
  ? {
      forcePathStyle: true,
      credentials: {
        accessKeyId: 'S3RVER', // This specific key is required when working offline
        secretAccessKey: 'S3RVER'
      },
      endpoint: 'http://localhost:4569'
    }
  : {};
const s3 = new S3(s3config);
const getParameter = async (name: string): Promise<string> => {
  const ssm = new SSM({});
  const getParametersCommand = new GetParameterCommand({
    Name: name,
    WithDecryption: true
  });
  const result = await ssm.send(getParametersCommand);
  return result.Parameter.Value;
};

const mergeData = (dataArray: Array<any>) => {
  const parser = new XMLParser();
  dataArray.forEach((data) => parser.parse(data));
  const result = parser.parse(dataArray[0]);
  for (var i = 1; i < dataArray.length; i++) {
    const chunk = parser.parse(dataArray[i]);
    result['sf:FeatureCollection']['sf:featureMember'].push(
      ...chunk['sf:FeatureCollection']['sf:featureMember']
    );
  }
  const builder = new XMLBuilder({});
  const xmlResult = builder.build(result);
  return xmlResult;
};

const fetchMunicipalityData = async (event) => {
  const apiKey = offline
    ? apikey
    : await getParameter(
        `/DRKunta/${process.env.STAGE_NAME}/${event.municipality}`
      );

  if (event.format === 'xml') {
    for (var assetType of Object.entries(event.assetTypes)) {
      var offset = 0;
      const dataArray = [];
      var empty = false;
      while (!empty) {
        const url =
          event.url +
          `/collections/${
            assetType[1]
          }/items?f=gml&crs=http://www.opengis.net/def/crs/EPSG/0/3067&limit=5000&offset=${
            offset * 5000
          }`;

        const { data } = await axios.get(url, {
          headers: {
            Authorization: apiKey
          }
        });
        if (!data.includes('sf:featureMember')) {
          empty = true;
          break;
        }
        dataArray.push(data);
        offset += 1;
      }

      const payload = mergeData(dataArray);

      const now = new Date().toISOString().slice(0, 19);

      const putParams = {
        Bucket: `dr-kunta-${process.env.STAGE_NAME}-bucket`,
        Key: `infrao/${event.municipality}/${assetType[0]}/${now}.xml`,
        Body: payload
      };

      await new Upload({
        client: s3,
        params: putParams
      }).done();
    }
  }
  return;
};

export const main = middyfy(fetchMunicipalityData);
