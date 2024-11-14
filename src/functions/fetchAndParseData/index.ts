import {
  awsaccountid,
  bucketName,
  fetchSize,
  serviceName,
  stage
} from '@functions/config';
import { handlerPath } from '@libs/handler-resolver';
import { ServerlessFunction } from 'serverless';

// This is the serverless configuration file for the fetchAndParseData function
const fetchAndParseData: ServerlessFunction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  maximumRetryAttempts: 0,
  timeout: 300,
  environment: {
    FETCH_SIZE: String(fetchSize)
  },
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: ['ssm:DescribeParameters'],
      Resource: [`arn:aws:ssm:eu-west-1:${awsaccountid}:*`]
    },
    {
      Effect: 'Allow',
      Action: ['ssm:GetParameter', 'ssm:GetParameters'],
      Resource: [
        `arn:aws:ssm:eu-west-1:${awsaccountid}:parameter/${serviceName}/${stage}/*`
      ]
    },
    {
      Effect: 'Allow',
      Action: ['s3:PutObject', 's3:PutObjectAcl', 's3:PutObjectTagging'],
      Resource: [`arn:aws:s3:::${bucketName}/geojson/*`]
    },
    {
      Effect: 'Allow',
      Action: ['s3:ListBucket'],
      Resource: [`arn:aws:s3:::${bucketName}`]
    }
  ]
};

export default fetchAndParseData;
