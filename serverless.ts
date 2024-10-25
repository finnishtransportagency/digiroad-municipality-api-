import type { AWS } from '@serverless/typescript';
import 'dotenv/config';

import {
  calculateDelta,
  matchRoadLink,
  reportRejectedDelta,
  getNearbyLinks,
  execDelta2SQL,
  fetchAndParseData
} from '@functions/index';
import {
  offline,
  drsubnetid1,
  drsubnetid2,
  subnetid1,
  subnetid2,
  securitygroupid,
  vpcid,
  smtpusername,
  smtppassword,
  pgpassword,
  stage,
  email,
  drsecuritygroupid,
  awsaccountid,
  pghost,
  pgport,
  pgdatabase,
  pguser
} from '@functions/config';

export type ServerlessFunction = Exclude<AWS['functions'], undefined>[string] & {
  iamRoleStatements: Array<{
    Effect: 'Allow' | 'Deny';
    Action: Array<string>;
    Resource: Array<string>;
  }>;
};

interface ServerlessConfiguration extends AWS {
  functions: {
    [key: string]: ServerlessFunction;
  };
}

const serverlessConfiguration: ServerlessConfiguration = {
  service: 'dr-kunta',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild',
    'serverless-offline',
    'serverless-s3-local',
    'serverless-iam-roles-per-function'
  ],
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10
    },
    drSubnetId1: offline ? '' : `\${ssm:${drsubnetid1}}`,
    drSubnetId2: offline ? '' : `\${ssm:${drsubnetid2}}`,
    drSecurityGroupId: offline ? '' : `\${ssm:${drsecuritygroupid}}`,
    subnetId1: offline ? '' : `\${ssm:${subnetid1}}`,
    subnetId2: offline ? '' : `\${ssm:${subnetid2}}`,
    securityGroupId: offline ? '' : `\${ssm:${securitygroupid}}`,
    vpcId: offline ? '' : `\${ssm:${vpcid}}`,
    pgHost: offline ? '' : `\${ssm:${pghost}}`,
    pgPort: offline ? '' : `\${ssm:${pgport}}`,
    pgDatabase: offline ? '' : `\${ssm:${pgdatabase}}`,
    pgUser: offline ? '' : `\${ssm:${pguser}}`,
    pgPasswordSsmKey: offline ? '' : `\${ssm:${pgpassword}}`,
    smtpUsernameSsmKey: offline ? '' : `\${ssm:${smtpusername}}`,
    smtpPasswordSsmKey: offline ? '' : `\${ssm:${smtppassword}}`
  },
  provider: {
    name: 'aws',
    runtime: offline ? 'nodejs16.x' : 'nodejs18.x',
    stage: stage,
    environment: {
      OFFLINE: String(offline),
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      STAGE_NAME: stage,
      OPERATOR_EMAIL: email,
      DR_SECURITY_GROUP_ID: '${self:custom.drSecurityGroupId}',
      DR_SUBNET_ID_1: '${self:custom.drSubnetId1}',
      DR_SUBNET_ID_2: '${self:custom.drSubnetId2}',
      AWS_ACCOUNT_ID: awsaccountid,
      PGHOST: '${self:custom.pgHost}',
      PGPORT: '${self:custom.pgPort}',
      PGDATABASE: '${self:custom.pgDatabase}',
      PGUSER: '${self:custom.pgUser}',
      PGPASSWORD_SSM_KEY: '${self:custom.pgPasswordSsmKey}',
      SMTP_USERNAME_SSM_KEY: '${self:custom.smtpUsernameSsmKey}',
      SMTP_PASSWORD_SSM_KEY: '${self:custom.smtpPasswordSsmKey}'
    },
    region: 'eu-west-1',
    vpc: {
      securityGroupIds: ['${self:custom.securityGroupId}'],
      subnetIds: ['${self:custom.subnetId1}', '${self:custom.subnetId2}']
    },
    iam: {
      // No need offline, so defined here with ${env:***}-syntax
      deploymentRole:
        'arn:aws:iam::${env:AWS_ACCOUNT_ID}:role/${env:AWS_CLOUDFORMATION_ROLE}'
    }
  },
  functions: {
    fetchAndParseData,
    calculateDelta,
    matchRoadLink,
    reportRejectedDelta,
    getNearbyLinks,
    execDelta2SQL
  },
  resources: {
    Resources: {
      drKuntaBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: `dr-kunta-${stage}-bucket`,
          LifecycleConfiguration: {
            Rules: [
              {
                ExpirationInDays: 30,
                Prefix: '/matchRoadLink/',
                Status: 'Enabled'
              },
              {
                ExpirationInDays: 30,
                Prefix: '/getNearbyLinks/',
                Status: 'Enabled'
              },
              {
                ExpirationInDays: 30,
                Prefix: '/calculateDelta/',
                Status: 'Enabled'
              },
              {
                ExpirationInDays: 30,
                Prefix: '/infrao/',
                Status: 'Enabled'
              }
            ]
          }
        }
      }
    }
  },
  package: { individually: true }
};

module.exports = serverlessConfiguration;
