import { InvokeCommand, InvokeCommandOutput, Lambda } from '@aws-sdk/client-lambda';
import { offline, serviceName, stage } from '@functions/config';
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
      FunctionName: `${serviceName}-${stage}-${FunctionName}`,
      InvocationType,
      Payload
    })
  );

export const middyfy = (handler: Handler) => {
  return middy(handler).use(middyJsonBodyParser());
};
