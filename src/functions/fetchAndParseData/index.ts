import { awsaccountid, stage } from '@functions/config';
import { handlerPath } from '@libs/handler-resolver';
import { ServerlessFunction } from 'serverless';

// This is the serverless configuration file for the fetchAndParseData function
const fetchAndParseData: ServerlessFunction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  maximumRetryAttempts: 0,
  timeout: 60,
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: ['ssm:DescribeParameters'],
      Resource: [`arn:aws:ssm:eu-west-1:${awsaccountid}:*`]
    },
    {
      Effect: 'Allow',
      Action: ['ssm:GetParameter', 'ssm:GetParameters'],
      Resource: [`arn:aws:ssm:eu-west-1:${awsaccountid}:parameter/DRKunta/${stage}/*`]
    },
    {
      Effect: 'Allow',
      Action: ['s3:PutObject', 's3:PutObjectAcl'],
      Resource: [`arn:aws:s3:::dr-kunta-${stage}-bucket/infrao/*`]
    },
    {
      Effect: 'Allow',
      Action: ['s3:ListBucket'],
      Resource: [`arn:aws:s3:::dr-kunta-${stage}-bucket`]
    }
  ]
};

export default fetchAndParseData;
