import { awsaccountid, stage } from '@functions/config';
import { handlerPath } from '@libs/handler-resolver';
import { ServerlessFunction } from 'serverless';

const matchRoadLink: ServerlessFunction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  maximumRetryAttempts: 0,
  timeout: 300,
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: ['lambda:InvokeFunction'],
      Resource: [
        `arn:aws:lambda:eu-west-1:${awsaccountid}:function:DRKunta-${stage}-reportRejectedDelta`,
        `arn:aws:lambda:eu-west-1:${awsaccountid}:function:DRKunta-${stage}-getNearbyLinks`,
        `arn:aws:lambda:eu-west-1:${awsaccountid}:function:DRKunta-${stage}-execDelta2SQL`
      ]
    },
    {
      Effect: 'Allow',
      Action: ['s3:ListBucket', 's3:GetObject'],
      Resource: [
        `arn:aws:s3:::dr-kunta-${stage}-bucket/calculateDelta/*`,
        `arn:aws:s3:::dr-kunta-${stage}-bucket/getNearbyLinks/*`
      ]
    },
    {
      Effect: 'Allow',
      Action: ['s3:PutObject', 's3:PutObjectAcl'],
      Resource: [
        `arn:aws:s3:::dr-kunta-${stage}-bucket/matchRoadLink/*`,
        `arn:aws:s3:::dr-kunta-${stage}-bucket/logs/*`,
        `arn:aws:s3:::dr-kunta-${stage}-bucket/getNearbyLinksRequestPayload/*`
      ]
    }
  ]
};

export default matchRoadLink;
