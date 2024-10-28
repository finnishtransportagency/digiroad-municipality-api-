import {
  awsaccountid,
  bucketName,
  pgdatabase,
  pghost,
  pgpassword,
  pgport,
  pguser
} from '@functions/config';
import { handlerPath } from '@libs/handler-resolver';
import { ServerlessFunction } from 'serverless';

const getNearbyLinks: ServerlessFunction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  maximumRetryAttempts: 0,
  timeout: 300,
  vpc: {
    securityGroupIds: ['${self:custom.drSecurityGroupId}'],
    subnetIds: ['${self:custom.drSubnetId1}', '${self:custom.drSubnetId2}']
  },
  environment: {
    PGHOST: pghost,
    PGUSER: pguser,
    PGPASSWORD_SSM_KEY: pgpassword,
    PGPORT: pgport,
    PGDATABASE: pgdatabase
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
        `arn:aws:ssm:eu-west-1:${awsaccountid}:parameter\${self:custom.pgPasswordSsmKey}`
      ]
    },
    {
      Effect: 'Allow',
      Action: ['s3:ListBucket', 's3:GetObject'],
      Resource: [
        `arn:aws:s3:::${bucketName}/matchRoadLink/*`,
        `arn:aws:s3:::${bucketName}/getNearbyLinksRequestPayload/*`
      ]
    },
    {
      Effect: 'Allow',
      Action: ['s3:PutObject', 's3:PutObjectAcl'],
      Resource: [`arn:aws:s3:::${bucketName}/getNearbyLinks/*`]
    }
  ]
};

export default getNearbyLinks;
