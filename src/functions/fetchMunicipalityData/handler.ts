import { middyfy } from '@libs/lambda';
import { SSM, GetParameterCommand } from '@aws-sdk/client-ssm';
import { S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import axios from 'axios';

const s3 = new S3({});
const getParameter = async (name: string): Promise<string> => {
  const ssm = new SSM({});
  const getParametersCommand = new GetParameterCommand({
    Name: name,
    WithDecryption: true
  });
  const result = await ssm.send(getParametersCommand);
  return result.Parameter.Value;
};

const fetchMunicipalityData = async (event) => {
  const apiKey = await getParameter(
    `/DRKunta/${process.env.STAGE_NAME}/${event.municipality}`
  );

  if (event.format === 'xml') {
    const url =
      event.url +
      '/collections/infrao:Rakenne/items?f=gml&crs=http://www.opengis.net/def/crs/EPSG/0/3067';

    const { data, status } = await axios.get(url, {
      headers: {
        'x-api-key': apiKey
      }
    });
    console.log(status);
    const now = new Date().toISOString().slice(0, 19);

    const putParams = {
      Bucket: `dr-kunta-${process.env.STAGE_NAME}-bucket`,
      Key: `infrao/${event.municipality}/${now}.xml`,
      Body: data
    };

    await new Upload({
      client: s3,
      params: putParams
    }).done();
  }
  return;
};

export const main = middyfy(fetchMunicipalityData);
