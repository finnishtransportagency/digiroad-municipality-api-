import { awsaccountid, bucketName, serviceName, stage } from '@functions/config';
import { handlerPath } from '@libs/handler-resolver';
import { ServerlessFunction } from 'serverless';

const calculateDelta: ServerlessFunction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  maximumRetryAttempts: 0,
  timeout: 300,
  memorySize: 4096,
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: ['s3:ListBucket', 's3:GetObject', 's3:DeleteObject'],
      Resource: [`arn:aws:s3:::${bucketName}/geojson/*`]
    },
    {
      Effect: 'Allow',
      Action: ['s3:PutObject', 's3:PutObjectAcl'],
      Resource: [`arn:aws:s3:::${bucketName}/calculateDelta/*`]
    },
    {
      Effect: 'Allow',
      Action: ['lambda:InvokeFunction'],
      Resource: [
        `arn:aws:lambda:eu-west-1:${awsaccountid}:function:${serviceName}-${stage}-matchRoadLink`,
        `arn:aws:lambda:eu-west-1:${awsaccountid}:function:${serviceName}-${stage}-reportRejectedDelta`
      ]
    }
  ]
};

export default calculateDelta;
