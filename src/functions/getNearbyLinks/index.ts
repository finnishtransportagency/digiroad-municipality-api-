import { awsaccountid, bucketName, MAX_OFFSET } from '@functions/config';
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
    MAX_OFFSET: String(MAX_OFFSET),
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
      Action: ['s3:PutObject', 's3:PutObjectAcl'],
      Resource: [`arn:aws:s3:::${bucketName}/getNearbyLinks/*`]
    }
  ]
};

export default getNearbyLinks;
