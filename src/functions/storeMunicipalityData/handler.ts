import { middyfy } from '@libs/lambda';
import { S3, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const storeMunicipalityData = async (event) => {
  const s3 = new S3({});
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

  const s3PutParams = {
    Bucket: `dr-kunta-${process.env.STAGE_NAME}-bucket`,
    Key: `update/${municipality}/${now}.json`
  };

  const s3PutCommand = new PutObjectCommand(s3PutParams);

  try {
    const url: string = await getSignedUrl(s3, s3PutCommand, { expiresIn: 60 });
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
