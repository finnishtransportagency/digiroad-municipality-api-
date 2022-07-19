import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import * as aws from 'aws-sdk';

const storeMunicipalityData = async () => {
  const s3 = new aws.S3();
  const now = new Date().toISOString().slice(0, 19);
  const municipality = 'espoo';

  try {
    const url: string = s3.getSignedUrl('putObject', {
      Bucket: `dr-kunta-${process.env.STAGE_NAME}-bucket`,
      Expires: 60 * 60,
      Key: `${municipality}/${now}.json`
    });
    return {
      statusCode: 307,
      headers: {
        location: url
      },
      body: 'success'
    };
  } catch (err) {
    console.log(err);
    return formatJSONResponse({
      message: 'Something went wrong'
    });
  }
};

export const main = middyfy(storeMunicipalityData);
