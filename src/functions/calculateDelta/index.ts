import { awsaccountid, stage } from '@functions/config';
import { handlerPath } from '@libs/handler-resolver';
import { ServerlessFunction } from 'serverless';

const calculateDelta: ServerlessFunction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  maximumRetryAttempts: 0,
  timeout: 300,
  memorySize: 4096,
  events: [
    {
      s3: {
        bucket: { Ref: 'drKuntaBucket' },
        event: 's3:ObjectCreated:*',
        existing: false,
        rules: [{ prefix: 'geojson/' }]
      }
    }
  ],
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: ['s3:ListBucket', 's3:GetObject', 's3:DeleteObject'],
      Resource: [`arn:aws:s3:::dr-kunta-${stage}-bucket/geojson/*`]
    },
    {
      Effect: 'Allow',
      Action: ['s3:PutObject', 's3:PutObjectAcl'],
      Resource: [`arn:aws:s3:::dr-kunta-${stage}-bucket/calculateDelta/*`]
    },
    {
      Effect: 'Allow',
      Action: ['lambda:InvokeFunction'],
      Resource: [
        `arn:aws:lambda:eu-west-1:${awsaccountid}:function:dr-kunta-${stage}-matchRoadLink`,
        `arn:aws:lambda:eu-west-1:${awsaccountid}:function:dr-kunta-${stage}-reportRejectedDelta`
      ]
    }
  ]
};

export default calculateDelta;
