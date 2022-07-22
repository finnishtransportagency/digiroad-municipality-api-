import { middyfy } from '@libs/lambda';
import * as aws from 'aws-sdk';
import { PayloadFeature } from '@functions/typing';

const matchRoadLinks = async (event) => {
  console.log(`matchRoadLinks invoked. Event: ${JSON.stringify(event)}`);

  const payLoad: PayloadFeature = {
    Created: event.Created,
    Deleted: event.Deleted,
    Updated: event.Updated
  };
  const lambda = new aws.Lambda();
  const param = {
    FunctionName: `digiroad-municipality-api-${process.env.STAGE_NAME}-reportRejectedDelta`,
    InvocationType: 'Event',
    Payload: JSON.stringify(payLoad)
  };
  await lambda.invoke(param).promise();
};

export const main = middyfy(matchRoadLinks);
