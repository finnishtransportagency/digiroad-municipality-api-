import {
  awsaccountid,
  bucketName,
  MAX_OFFSET_OBSTACLES,
  MAX_OFFSET_SIGNS
} from '@functions/config';
import { handlerPath } from '@libs/handler-resolver';
import { ServerlessFunction } from 'serverless';

const getNearbyLinks: ServerlessFunction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  maximumRetryAttempts: 0,
  timeout: 900,
  memorySize: 2048,
  ephemeralStorageSize: 1024,
  vpc: {
    securityGroupIds: ['${self:custom.drSecurityGroupId}'],
    subnetIds: ['${self:custom.drSubnetId1}', '${self:custom.drSubnetId2}']
  },
  environment: {
    MAX_OFFSET_SIGNS: String(MAX_OFFSET_SIGNS),
    MAX_OFFSET_OBSTACLES: String(MAX_OFFSET_OBSTACLES),
    PGHOST: '${self:custom.pgHost}',
    PGPORT: '${self:custom.pgPort}',
    PGDATABASE: '${self:custom.pgDatabase}',
    PGUSER: '${self:custom.pgUser}',
    PGPASSWORD_SSM_KEY: '${self:custom.pgPasswordSsmKey}'
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
      Action: ['s3:PutObject', 's3:PutObjectAcl', 's3:PutObjectTagging'],
      Resource: [`arn:aws:s3:::${bucketName}/getNearbyLinks/*`]
    }
  ]
};

export default getNearbyLinks;
