import { middyfy } from '@libs/lambda';
import * as aws from 'aws-sdk';

const reportRejectedDelta = async (event) => {
  const s3 = new aws.S3();
  const now = new Date().toISOString().slice(0, 19);
  const municipality = 'espoo';

  const params = {
    Bucket: `dr-kunta-${process.env.STAGE_NAME}-bucket`,
    Key: `logs/${municipality}/${now}`,
    Body: JSON.stringify(event)
  };

  s3.upload(params);
};

export const main = middyfy(reportRejectedDelta);
