import {
  InvokeCommand,
  InvokeCommandOutput,
  Lambda
} from '@aws-sdk/client-lambda';
import { offline } from '@functions/config';
import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import { Handler } from 'aws-lambda';

const lambda = new Lambda(
  offline
    ? {
        endpoint: 'http://localhost:3002' // serverless-offline lambda port
      }
    : {}
);

export const invokeLambda = async (
  FunctionName:
    | 'reportRejectedDelta'
    | 'matchRoadLink'
    | 'getNearbyLinks'
    | 'execDelta2SQL',
  InvocationType: 'Event' | 'RequestResponse',
  Payload: Buffer
): Promise<InvokeCommandOutput> =>
  await lambda.send(
    new InvokeCommand({
      FunctionName: `DRKunta-${process.env.STAGE_NAME}-${FunctionName}`,
      InvocationType,
      Payload
    })
  );

export const middyfy = (handler: Handler) => {
  return middy(handler).use(middyJsonBodyParser());
};
