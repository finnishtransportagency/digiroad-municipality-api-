import { awsaccountid, bucketName, fetchSize, serviceName } from '@functions/config';
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
      Resource: [`arn:aws:ssm:eu-west-1:${awsaccountid}:parameter/${serviceName}/*`]
    },
    {
      Effect: 'Allow',
      Action: [
        's3:PutObject',
        's3:PutObjectAcl',
        's3:PutObjectTagging',
        's3:DeleteObject'
      ],
      Resource: [
        `arn:aws:s3:::${bucketName}/geojson/*`,
        `arn:aws:s3:::${bucketName}/invalidInfrao/*`
      ]
    },
    {
      Effect: 'Allow',
      Action: ['s3:ListBucket'],
      Resource: [`arn:aws:s3:::${bucketName}`]
    }
  ]
};

export default fetchAndParseData;
