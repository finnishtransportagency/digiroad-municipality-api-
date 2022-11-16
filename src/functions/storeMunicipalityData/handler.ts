import { middyfy } from '@libs/lambda';
import * as aws from 'aws-sdk';

const storeMunicipalityData = async (event) => {
  const s3 = new aws.S3();
  const now = new Date().toISOString().slice(0, 19);
  const municipality = event.headers.municipality;
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
      Expires: 60 * 60,
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
