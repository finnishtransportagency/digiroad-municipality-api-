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
    subnetId1: offline ? '' : `\${ssm:${subnetid1}}`,
    subnetId2: offline ? '' : `\${ssm:${subnetid2}}`,
    securityGroupId: offline ? '' : `\${ssm:${securitygroupid}}`,
    vpcId: offline ? '' : `\${ssm:${vpcid}}`,
    pgPasswordSsmKey: offline ? '' : `\${ssm:${pgpassword}}`,
    smtpUsernameSsmKey: offline ? '' : `\${ssm:${smtpusername}}`,
    smtpPasswordSsmKey: offline ? '' : `\${ssm:${smtppassword}}`
  },
  provider: {
    name: 'aws',
    runtime: offline ? 'nodejs16.x' : 'nodejs18.x',
    stage: stage,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
      ...(stage === 'dev' && {
        apiKeys: [`DRKuntaOperatorKey`]
      }),
      ...((stage === 'test' || stage === 'prod') && {
        resourcePolicy: [
          {
            Effect: 'Allow',
            Principal: '*',
            Action: 'execute-api:Invoke',
            Resource: ['execute-api:/*']
          },
          {
            Effect: 'Deny',
            Principal: '*',
            Action: 'execute-api:Invoke',
            Resource: ['execute-api:/*'],
            Condition: {
              StringNotEquals: {
                'aws:SourceVpce': { Ref: 'drKuntaEndpoint' }
              }
            }
          }
        ]
      })
    },
    environment: {
      OFFLINE: String(offline),
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      STAGE_NAME: stage,
      OPERATOR_EMAIL: email,
      DR_SECURITY_GROUP_ID: offline ? '' : `\${ssm:${drsecuritygroupid}}`,
      DR_SUBNET_ID_1: '${self:custom.drSubnetId1}',
      DR_SUBNET_ID_2: '${self:custom.drSubnetId2}',
      AWS_ACCOUNT_ID: awsaccountid,
      PGHOST: offline ? '' : `\${ssm:${pghost}}`,
      PGPORT: offline ? '' : `\${ssm:${pgport}}`,
      PGDATABASE: offline ? '' : `\${ssm:${pgdatabase}}`,
      PGUSER: offline ? '' : `\${ssm:${pguser}}`,
      PGPASSWORD_SSM_KEY: '${self:custom.pgPasswordSsmKey}',
      SMTP_USERNAME_SSM_KEY: '${self:custom.smtpUsernameSsmKey}',
      SMTP_PASSWORD_SSM_KEY: '${self:custom.smtpPasswordSsmKey}'
    },
    region: 'eu-west-1',
    ...((stage === 'test' || stage === 'prod') && {
      endpointType: 'private',
      vpcEndpointIds: [{ Ref: 'drKuntaEndpoint' }],
      vpc: {
        securityGroupIds: ['${self:custom.securityGroupId}'],
        subnetIds: ['${self:custom.subnetId1}', '${self:custom.subnetId2}']
      }
    }),
    vpc: {
      securityGroupIds: ['${self:custom.securityGroupId}'],
      subnetIds: ['${self:custom.subnetId1}', '${self:custom.subnetId2}']
    }
  },
  // import the function via paths
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
      ...((stage === 'test' || stage === 'prod') && {
        VpceSecurityGroup: {
          Type: 'AWS::EC2::SecurityGroup',
          Properties: {
            GroupDescription: `DRKunta-${stage}-vpce-security-group`,
            GroupName: `DRKunta-${stage}-vpce-security-group`,
            SecurityGroupEgress: [
              {
                CidrIp: '0.0.0.0/0',
                Description: 'Allow all outbound traffic by default',
                IpProtocol: '-1'
              }
            ],
            SecurityGroupIngress: [
              {
                CidrIp: '0.0.0.0/0',
                FromPort: 443,
                IpProtocol: 'tcp',
                ToPort: 443
              },
              {
                CidrIpv6: '::/0',
                FromPort: 443,
                IpProtocol: 'tcp',
                ToPort: 443
              }
            ],
            VpcId: process.env.VPCID
          }
        },
        drKuntaEndpoint: {
          Type: 'AWS::EC2::VPCEndpoint',
          Properties: {
            PrivateDnsEnabled: false,
            SecurityGroupIds: [{ Ref: 'VpceSecurityGroup' }],
            ServiceName: 'com.amazonaws.eu-west-1.execute-api',
            SubnetIds: [process.env.SUBNETAID, process.env.SUBNETBID],
            VpcEndpointType: 'Interface',
            VpcId: process.env.VPCID,
            PolicyDocument: {
              Statement: [
                {
                  Principal: '*',
                  Action: ['execute-api:Invoke'],
                  Effect: 'Allow',
                  Resource: [`arn:aws:execute-api:eu-west-1:${awsaccountid}:*/*`]
                }
              ]
            }
          }
        }
      }),
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
