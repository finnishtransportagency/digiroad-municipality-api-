import { middyfy } from '@libs/lambda';
import { S3 } from "@aws-sdk/client-s3";

const storeMunicipalityData = async (event) => {
  const s3 = new S3();
  const now = new Date().toISOString().slice(0, 19);
  const kuntaHeader = event.headers['kunta-client'];
  const municipality = kuntaHeader.split(' ')[0].toLowerCase();
  if (!municipality) {
    console.error('No Municipality-header, aborting');
    return {
      statusCode: 400,
      body: 'municipality header missing'
    };
  }

  try {
    const url: string = s3.getSignedUrl('putObject', {
      Bucket: `dr-kunta-${process.env.STAGE_NAME}-bucket`,
      Expires: 60,
      Key: `update/${municipality}/${now}.json`
    });
    return {
      statusCode: 307,
      headers: {
        location: url
      },
      body: 'success'
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 400,
      body: 'Something went wrong'
    };
  }
};

export const main = middyfy(storeMunicipalityData);
