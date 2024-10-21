import {
  awsaccountid,
  drsecuritygroupid,
  drsubnetid1,
  drsubnetid2,
  pgdatabase,
  pghost,
  pgpassword,
  pgport,
  pguser,
  stage
} from '@functions/config';
import { handlerPath } from '@libs/handler-resolver';
import { ServerlessFunction } from 'serverless';

const getNearbyLinks: ServerlessFunction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  maximumRetryAttempts: 0,
  timeout: 300,
  vpc: {
    securityGroupIds: [drsecuritygroupid],
    subnetIds: [drsubnetid1, drsubnetid2]
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
        `arn:aws:ssm:eu-west-1:${awsaccountid}:parameter${'${self:custom.pgPasswordSsmKey}'}`
      ]
    },
    {
      Effect: 'Allow',
      Action: ['s3:ListBucket', 's3:GetObject'],
      Resource: [
        `arn:aws:s3:::dr-kunta-${stage}-bucket/matchRoadLink/*`,
        `arn:aws:s3:::dr-kunta-${stage}-bucket/getNearbyLinksRequestPayload/*`
      ]
    },
    {
      Effect: 'Allow',
      Action: ['s3:PutObject', 's3:PutObjectAcl'],
      Resource: [`arn:aws:s3:::dr-kunta-${stage}-bucket/getNearbyLinks/*`]
    }
  ]
};

export default getNearbyLinks;
