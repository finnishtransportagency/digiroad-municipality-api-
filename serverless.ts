/* eslint-disable prettier/prettier */
import type { AWS } from '@serverless/typescript';
import * as dotenv from 'dotenv';
dotenv.config();

import {
  calculateDelta,
  matchRoadLink,
  reportRejectedDelta,
  getNearbyLinks,
  execDelta2SQL,
  parseXML,
  fetchMunicipalityData,
  createSchedule,
  listSchedules,
  deleteSchedule,
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
  drsecuritygroupid,
  awsaccountid,
  pghost,
  pgport,
  pgdatabase,
  pguser,
  awscloudformationrole,
  email
} from '@functions/config';

const serverlessConfiguration: AWS = {
  service: 'dr-kunta',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-s3-local'],
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
    drSubnetId1: `\${ssm:${drsubnetid1}}`,
    drSubnetId2: `\${ssm:${drsubnetid2}}`,
    subnetId1: `\${ssm:${subnetid1}}`,
    subnetId2: `\${ssm:${subnetid2}}`,
    securityGroupId: `\${ssm:${securitygroupid}}`,
    vpcId: `\${ssm:${vpcid}}`,
    pgPasswordSsmKey: `\${ssm:${pgpassword}}`,
    smtpUsernameSsmKey: `\${ssm:${smtpusername}}`,
    smtpPasswordSsmKey: `\${ssm:${smtppassword}}`
  },
  provider: {
    name: 'aws',
    runtime: offline ? 'nodejs16.x' : 'nodejs18.x',
    stage: stage,
    iam: { deploymentRole: `arn:aws:iam::${awsaccountid}:role/${awscloudformationrole}` },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
      ...(stage === 'dev' && {
        apiKeys: [`dr-kunta-dev-operator-key`]
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
      DR_SECURITY_GROUP_ID: `\${ssm:${drsecuritygroupid}}`,
      DR_SUBNET_ID_1: '${self:custom.drSubnetId1}',
      DR_SUBNET_ID_2: '${self:custom.drSubnetId2}',
      AWS_ACCOUNT_ID: awsaccountid,
      PGHOST: `\${ssm:${pghost}}`,
      PGPORT: `\${ssm:${pgport}}`,
      PGDATABASE: `\${ssm:${pgdatabase}}`,
      PGUSER: `\${ssm:${pguser}}`,
      PGPASSWORD_SSM_KEY: '${self:custom.pgPasswordSsmKey}',
      SMTP_USERNAME_SSM_KEY: '${self:custom.smtpUsernameSsmKey}',
      SMTP_PASSWORD_SSM_KEY: '${self:custom.smtpPasswordSsmKey}'
    },
    region: 'eu-west-1',
    ...((stage === 'test' || stage === 'prod') && {
      endpointType: 'PRIVATE',
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
    parseXML,
    calculateDelta,
    matchRoadLink,
    reportRejectedDelta,
    getNearbyLinks,
    execDelta2SQL,
    fetchMunicipalityData,
    createSchedule,
    listSchedules,
    deleteSchedule
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
            VpcId: '${self:custom.vpcId}'
          }
        },
        drKuntaEndpoint: {
          Type: 'AWS::EC2::VPCEndpoint',
          Properties: {
            PrivateDnsEnabled: false,
            SecurityGroupIds: [{ Ref: 'VpceSecurityGroup' }],
            ServiceName: 'com.amazonaws.eu-west-1.execute-api',
            SubnetIds: ['${self:custom.subnetId1}', '${self:custom.subnetId2}'],
            VpcEndpointType: 'Interface',
            VpcId: '${self:custom.vpcId}',
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
      drKuntaScheduleGroup: {
        Type: 'AWS::Scheduler::ScheduleGroup',
        Properties: {
          Name: `dr-kunta-${stage}`
        }
      },
      drKuntaBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: `dr-kunta-${stage}-bucket-placeholder`, // poista placeholder
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
      },
      fetchMunicipalityDataScheduleRole: {
        Type: 'AWS::IAM::Role',
        Properties: {
          RoleName: `dr-kunta-${stage}-fetchMunicipalityDataScheduleRole`,
          AssumeRolePolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: {
                  Service: 'scheduler.amazonaws.com'
                },
                Action: 'sts:AssumeRole'
              }
            ]
          },
          ManagedPolicyArns: [
            'arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole'
          ],
          Policies: [
            {
              PolicyName: `dr-kunta-${stage}-fetchMunicipalityDataSchedulePolicy`,
              PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                  {
                    Effect: 'Allow',
                    Action: ['lambda:InvokeFunction'],
                    Resource: [
                      `arn:aws:lambda:eu-west-1:${awsaccountid}:function:dr-kunta-${stage}-fetchMunicipalityData:*`,
                      `arn:aws:lambda:eu-west-1:${awsaccountid}:function:dr-kunta-${stage}-fetchMunicipalityData`
                    ]
                  }
                ]
              }
            }
          ]
        }
      }
    }
  },
  package: { individually: true }
};

module.exports = serverlessConfiguration;
