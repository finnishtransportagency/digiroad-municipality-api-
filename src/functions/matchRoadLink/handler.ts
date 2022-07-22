import { middyfy } from '@libs/lambda';
import * as aws from 'aws-sdk';

const matchRoadLinks = async (event) => {
  console.log(`matchRoadLinks invoked. Event: ${JSON.stringify(event)}`);

  interface ObstacleFeature {
    type: string;
    properties: {
      ID: number;
      EST_TYYPPI: number;
    };
    geometry: {
      type: string;
      coordinates: Array<number>;
    };
  }

  interface PayloadFeature {
    Created: Array<ObstacleFeature>;
    Deleted: Array<ObstacleFeature>;
    Updated: Array<ObstacleFeature>;
  }

  const payLoad: PayloadFeature = {
    Created: event.created,
    Deleted: event.deleted,
    Updated: event.updated
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
