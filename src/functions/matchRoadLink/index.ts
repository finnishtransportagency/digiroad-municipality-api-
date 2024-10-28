import {
  awsaccountid,
  bucketName,
  MAX_OFFSET,
  serviceName,
  stage
} from '@functions/config';
import { handlerPath } from '@libs/handler-resolver';
import { ServerlessFunction } from 'serverless';

const matchRoadLink: ServerlessFunction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  maximumRetryAttempts: 0,
  timeout: 300,
  environment: {
    MAX_OFFSET: String(MAX_OFFSET)
  },
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: ['lambda:InvokeFunction'],
      Resource: [
        `arn:aws:lambda:eu-west-1:${awsaccountid}:function:${serviceName}-${stage}-reportRejectedDelta`,
        `arn:aws:lambda:eu-west-1:${awsaccountid}:function:${serviceName}-${stage}-getNearbyLinks`,
        `arn:aws:lambda:eu-west-1:${awsaccountid}:function:${serviceName}-${stage}-execDelta2SQL`
      ]
    },
    {
      Effect: 'Allow',
      Action: ['s3:ListBucket', 's3:GetObject'],
      Resource: [
        `arn:aws:s3:::${bucketName}/calculateDelta/*`,
        `arn:aws:s3:::${bucketName}/getNearbyLinks/*`
      ]
    },
    {
      Effect: 'Allow',
      Action: ['s3:PutObject', 's3:PutObjectAcl'],
      Resource: [
        `arn:aws:s3:::${bucketName}/matchRoadLink/*`,
        `arn:aws:s3:::${bucketName}/logs/*`,
        `arn:aws:s3:::${bucketName}/getNearbyLinksRequestPayload/*`
      ]
    }
  ]
};

export default matchRoadLink;
