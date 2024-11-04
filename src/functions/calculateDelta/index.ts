import { awsaccountid, bucketName, offline, serviceName, stage } from '@functions/config';
import { handlerPath } from '@libs/handler-resolver';
import { ServerlessFunction } from 'serverless';

const calculateDelta: ServerlessFunction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  maximumRetryAttempts: 0,
  timeout: 600,
  memorySize: 4096,
  ...(offline && {
    events: [
      {
        s3: {
          bucket: bucketName,
          event: 's3:ObjectCreated:*',
          existing: true,
          rules: [{ prefix: 'geojson/' }]
        }
      }
    ]
  }),
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: ['s3:ListBucket'],
      Resource: [`arn:aws:s3:::${bucketName}`]
    },
    {
      Effect: 'Allow',
      Action: ['s3:GetObject', 's3:DeleteObject'],
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
