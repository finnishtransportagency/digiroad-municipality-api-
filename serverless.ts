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
  email,
  drsecuritygroupid,
  awsaccountid,
  pghost,
  pgport,
  pgdatabase,
  pguser
} from '@functions/config';

const serverlessConfiguration: AWS = {
  service: 'DRKunta',
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
    calculateDelta,
    matchRoadLink,
    reportRejectedDelta,
    getNearbyLinks,
    execDelta2SQL,
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
      drKuntaScheduleGroup: {
        Type: 'AWS::Scheduler::ScheduleGroup',
        Properties: {
          Name: `DRKunta-${stage}`
        }
      },
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
      },
      createScheduleRole: {
        Type: 'AWS::IAM::Role',
        Properties: {
          RoleName: `DRKunta-${stage}-createScheduleRole`,
          AssumeRolePolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: {
                  Service: 'lambda.amazonaws.com'
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
              PolicyName: `DRKunta-${stage}-createSchedulePolicy`,
              PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                  {
                    Effect: 'Allow',
                    Action: ['ssm:DescribeParameters'],
                    Resource: [`arn:aws:ssm:eu-west-1:${awsaccountid}:*`]
                  },
                  {
                    Effect: 'Allow',
                    Action: [
                      'ssm:GetParameter',
                      'ssm:GetParameters',
                      'ssm:PutParameter',
                      'ssm:DeleteParameter'
                    ],
                    Resource: `arn:aws:ssm:eu-west-1:${awsaccountid}:parameter/DRKunta/${stage}/*`
                  },
                  {
                    Effect: 'Allow',
                    Action: ['scheduler:CreateSchedule'],
                    Resource: `arn:aws:scheduler:eu-west-1:${awsaccountid}:schedule/DRKunta-${stage}/DRKunta-${stage}-*`
                  },
                  {
                    Effect: 'Allow',
                    Action: [
                      'logs:CreateLogGroup',
                      'logs:CreateLogStream',
                      'logs:PutLogEvents'
                    ],
                    Resource: `arn:aws:logs:eu-west-1:${awsaccountid}:log-groups:/aws/lambda/*:*:*`
                  },
                  {
                    Action: ['iam:PassRole'],
                    Resource: `arn:aws:iam::${awsaccountid}:role/DRKunta-${stage}-fetchMunicipalityDataScheduleRole`,
                    Effect: 'Allow'
                  }
                ]
              }
            }
          ]
        }
      },
      deleteScheduleRole: {
        Type: 'AWS::IAM::Role',
        Properties: {
          RoleName: `DRKunta-${stage}-deleteScheduleRole`,
          AssumeRolePolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: {
                  Service: 'lambda.amazonaws.com'
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
              PolicyName: `DRKunta-${stage}-deleteSchedulePolicy`,
              PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                  {
                    Effect: 'Allow',
                    Action: ['ssm:DescribeParameters'],
                    Resource: [`arn:aws:ssm:eu-west-1:${awsaccountid}:*`]
                  },
                  {
                    Effect: 'Allow',
                    Action: [
                      'ssm:GetParameter',
                      'ssm:GetParameters',
                      'ssm:DeleteParameter'
                    ],
                    Resource: `arn:aws:ssm:eu-west-1:${awsaccountid}:parameter/DRKunta/${stage}/*`
                  },
                  {
                    Effect: 'Allow',
                    Action: ['scheduler:GetSchedule', 'scheduler:DeleteSchedule'],
                    Resource: `arn:aws:scheduler:eu-west-1:${awsaccountid}:schedule/DRKunta-${stage}/DRKunta-${stage}-*`
                  },
                  {
                    Effect: 'Allow',
                    Action: [
                      'logs:CreateLogGroup',
                      'logs:CreateLogStream',
                      'logs:PutLogEvents'
                    ],
                    Resource: `arn:aws:logs:eu-west-1:${awsaccountid}:log-groups:/aws/lambda/*:*:*`
                  }
                ]
              }
            }
          ]
        }
      },
      listSchedulesRole: {
        Type: 'AWS::IAM::Role',
        Properties: {
          RoleName: `DRKunta-${stage}-listSchedulesRole`,
          AssumeRolePolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: {
                  Service: 'lambda.amazonaws.com'
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
              PolicyName: `DRKunta-${stage}-listSchedulesPolicy`,
              PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                  {
                    Effect: 'Allow',
                    Action: ['scheduler:ListSchedules'],
                    Resource: `arn:aws:scheduler:eu-west-1:${awsaccountid}:schedule/*/*`
                  },
                  {
                    Effect: 'Allow',
                    Action: ['scheduler:GetSchedule'],
                    Resource: `arn:aws:scheduler:eu-west-1:${awsaccountid}:schedule/DRKunta-${stage}/*`
                  },
                  {
                    Effect: 'Allow',
                    Action: [
                      'logs:CreateLogGroup',
                      'logs:CreateLogStream',
                      'logs:PutLogEvents'
                    ],
                    Resource: `arn:aws:logs:eu-west-1:${awsaccountid}:log-groups:/aws/lambda/*:*:*`
                  }
                ]
              }
            }
          ]
        }
      },
      fetchMunicipalityDataScheduleRole: {
        Type: 'AWS::IAM::Role',
        Properties: {
          RoleName: `DRKunta-${stage}-fetchMunicipalityDataScheduleRole`,
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
              PolicyName: `DRKunta-${stage}-fetchMunicipalityDataSchedulePolicy`,
              PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                  {
                    Effect: 'Allow',
                    Action: ['lambda:InvokeFunction'],
                    Resource: [
                      `arn:aws:lambda:eu-west-1:${awsaccountid}:function:DRKunta-${stage}-fetchMunicipalityData:*`,
                      `arn:aws:lambda:eu-west-1:${awsaccountid}:function:DRKunta-${stage}-fetchMunicipalityData`
                    ]
                  }
                ]
              }
            }
          ]
        }
      },
      fetchMunicipalityDataRole: {
        Type: 'AWS::IAM::Role',
        Properties: {
          RoleName: `DRKunta-${stage}-fetchMunicipalityDataRole`,
          AssumeRolePolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: {
                  Service: 'lambda.amazonaws.com'
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
              PolicyName: `DRKunta-${stage}-fetchMunicipalityDataPolicy`,
              PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                  {
                    Effect: 'Allow',
                    Action: ['ssm:DescribeParameters'],
                    Resource: [`arn:aws:ssm:eu-west-1:${awsaccountid}:*`]
                  },
                  {
                    Effect: 'Allow',
                    Action: ['ssm:GetParameter', 'ssm:GetParameters'],
                    Resource: `arn:aws:ssm:eu-west-1:${awsaccountid}:parameter/DRKunta/${stage}/*`
                  },
                  {
                    Effect: 'Allow',
                    Action: ['s3:PutObject', 's3:PutObjectAcl'],
                    Resource: `arn:aws:s3:::dr-kunta-${stage}-bucket/infrao/*`
                  },
                  {
                    Effect: 'Allow',
                    Action: ['s3:ListBucket'],
                    Resource: `arn:aws:s3:::dr-kunta-${stage}-bucket`
                  },
                  {
                    Effect: 'Allow',
                    Action: [
                      'logs:CreateLogGroup',
                      'logs:CreateLogStream',
                      'logs:PutLogEvents'
                    ],
                    Resource: `arn:aws:logs:eu-west-1:${awsaccountid}:log-groups:/aws/lambda/*:*:*`
                  }
                ]
              }
            }
          ]
        }
      },
      calculateDeltaRole: {
        Type: 'AWS::IAM::Role',
        Properties: {
          RoleName: `DRKunta-${stage}-calculateDeltaRole`,
          AssumeRolePolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: {
                  Service: 'lambda.amazonaws.com'
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
              PolicyName: `DRKunta-${stage}-calculateDeltaPolicy`,
              PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                  {
                    Effect: 'Allow',
                    Action: ['s3:ListBucket', 's3:GetObject', 's3:DeleteObject'],
                    Resource: `arn:aws:s3:::dr-kunta-${stage}-bucket/geojson/*`
                  },
                  {
                    Effect: 'Allow',
                    Action: ['s3:ListBucket'],
                    Resource: `arn:aws:s3:::dr-kunta-${stage}-bucket`
                  },
                  {
                    Effect: 'Allow',
                    Action: ['lambda:InvokeFunction'],
                    Resource: `arn:aws:lambda:eu-west-1:${awsaccountid}:function:DRKunta-${stage}-matchRoadLink`
                  },
                  {
                    Effect: 'Allow',
                    Action: ['lambda:InvokeFunction'],
                    Resource: `arn:aws:lambda:eu-west-1:${awsaccountid}:function:DRKunta-${stage}-reportRejectedDelta`
                  },
                  {
                    Effect: 'Allow',
                    Action: [
                      'logs:CreateLogGroup',
                      'logs:CreateLogStream',
                      'logs:PutLogEvents'
                    ],
                    Resource: `arn:aws:logs:eu-west-1:${awsaccountid}:log-group:/aws/lambda/*`
                  },
                  {
                    Effect: 'Allow',
                    Action: ['s3:PutObject', 's3:PutObjectAcl'],
                    Resource: `arn:aws:s3:::dr-kunta-${stage}-bucket/calculateDelta/*`
                  }
                ]
              }
            }
          ]
        }
      },
      parseXMLRole: {
        Type: 'AWS::IAM::Role',
        Properties: {
          RoleName: `DRKunta-${stage}-parseXMLRole`,
          AssumeRolePolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: {
                  Service: 'lambda.amazonaws.com'
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
              PolicyName: `DRKunta-${stage}-parseXMLPolicy`,
              PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                  {
                    Effect: 'Allow',
                    Action: ['s3:ListBucket', 's3:GetObject'],
                    Resource: `arn:aws:s3:::dr-kunta-${stage}-bucket/infrao/*`
                  },
                  {
                    Effect: 'Allow',
                    Action: ['s3:PutObject', 's3:PutObjectAcl'],
                    Resource: `arn:aws:s3:::dr-kunta-${stage}-bucket/geojson/*`
                  },
                  {
                    Effect: 'Allow',
                    Action: ['s3:ListBucket'],
                    Resource: `arn:aws:s3:::dr-kunta-${stage}-bucket`
                  },
                  {
                    Effect: 'Allow',
                    Action: ['lambda:InvokeFunction'],
                    Resource: `arn:aws:lambda:eu-west-1:${awsaccountid}:function:DRKunta-${stage}-reportRejectedDelta`
                  },
                  {
                    Effect: 'Allow',
                    Action: [
                      'logs:CreateLogGroup',
                      'logs:CreateLogStream',
                      'logs:PutLogEvents'
                    ],
                    Resource: `arn:aws:logs:eu-west-1:${awsaccountid}:log-group:/aws/lambda/*`
                  }
                ]
              }
            }
          ]
        }
      },
      DBLambdaRole: {
        Type: 'AWS::IAM::Role',
        Properties: {
          RoleName: `DRKunta-${stage}-DBLambdaRole`,
          AssumeRolePolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: {
                  Service: 'lambda.amazonaws.com'
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
              PolicyName: `DRKunta-${stage}-DBLambdaPolicy`,
              PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                  {
                    Effect: 'Allow',
                    Action: ['ssm:DescribeParameters'],
                    Resource: [`arn:aws:ssm:eu-west-1:${awsaccountid}:*`]
                  },
                  {
                    Effect: 'Allow',
                    Action: ['ssm:GetParameter', 'ssm:GetParameters'],
                    Resource: `arn:aws:ssm:eu-west-1:${awsaccountid}:parameter${'${self:custom.pgPasswordSsmKey}'}`
                  },
                  {
                    Effect: 'Allow',
                    Action: [
                      'logs:CreateLogGroup',
                      'logs:CreateLogStream',
                      'logs:PutLogEvents'
                    ],
                    Resource: `arn:aws:logs:eu-west-1:${awsaccountid}:log-groups:/aws/lambda/*:*:*`
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
                    Resource: `arn:aws:s3:::dr-kunta-${stage}-bucket/getNearbyLinks/*`
                  }
                ]
              }
            }
          ]
        }
      },
      matchRoadLinkRole: {
        Type: 'AWS::IAM::Role',
        Properties: {
          RoleName: `DRKunta-${stage}-matchRoadLinkRole`,
          AssumeRolePolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: {
                  Service: 'lambda.amazonaws.com'
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
              PolicyName: `DRKunta-${stage}-matchRoadLinkPolicy`,
              PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                  {
                    Effect: 'Allow',
                    Action: ['lambda:InvokeFunction'],
                    Resource: `arn:aws:lambda:eu-west-1:${awsaccountid}:function:DRKunta-${stage}-reportRejectedDelta`
                  },
                  {
                    Effect: 'Allow',
                    Action: ['lambda:InvokeFunction'],
                    Resource: `arn:aws:lambda:eu-west-1:${awsaccountid}:function:DRKunta-${stage}-getNearbyLinks`
                  },
                  {
                    Effect: 'Allow',
                    Action: ['lambda:InvokeFunction'],
                    Resource: `arn:aws:lambda:eu-west-1:${awsaccountid}:function:DRKunta-${stage}-execDelta2SQL`
                  },
                  {
                    Effect: 'Allow',
                    Action: [
                      'logs:CreateLogGroup',
                      'logs:CreateLogStream',
                      'logs:PutLogEvents'
                    ],
                    Resource: `arn:aws:logs:eu-west-1:${awsaccountid}:log-groups:/aws/lambda/*:*:*`
                  },
                  {
                    Effect: 'Allow',
                    Action: ['s3:ListBucket', 's3:GetObject'],
                    Resource: [
                      `arn:aws:s3:::dr-kunta-${stage}-bucket/calculateDelta/*`,
                      `arn:aws:s3:::dr-kunta-${stage}-bucket/getNearbyLinks/*`
                    ]
                  },
                  {
                    Effect: 'Allow',
                    Action: ['s3:PutObject', 's3:PutObjectAcl'],
                    Resource: [
                      `arn:aws:s3:::dr-kunta-${stage}-bucket/matchRoadLink/*`,
                      `arn:aws:s3:::dr-kunta-${stage}-bucket/logs/*`,
                      `arn:aws:s3:::dr-kunta-${stage}-bucket/getNearbyLinksRequestPayload/*`
                    ]
                  }
                ]
              }
            }
          ]
        }
      },
      reportRejectedDeltaRole: {
        Type: 'AWS::IAM::Role',
        Properties: {
          RoleName: `DRKunta-${stage}-reportRejectedDeltaRole`,
          AssumeRolePolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Principal: {
                  Service: 'lambda.amazonaws.com'
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
              PolicyName: `DRKunta-${stage}-reportRejectedDeltaPolicy`,
              PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                  {
                    Effect: 'Allow',
                    Action: [
                      'logs:CreateLogGroup',
                      'logs:CreateLogStream',
                      'logs:PutLogEvents'
                    ],
                    Resource: `arn:aws:logs:eu-west-1:${awsaccountid}:log-groups:/aws/lambda/*:*:*`
                  },
                  {
                    Effect: 'Allow',
                    Action: [
                      's3:PutObject',
                      's3:PutObjectAcl',
                      's3:ListBucket',
                      's3:GetObject',
                      's3:DeleteObject'
                    ],
                    Resource: `arn:aws:s3:::dr-kunta-${stage}-bucket/*`
                  },
                  {
                    Effect: 'Allow',
                    Action: ['ssm:DescribeParameters'],
                    Resource: [`arn:aws:ssm:eu-west-1:${awsaccountid}:*`]
                  },
                  {
                    Effect: 'Allow',
                    Action: ['ssm:GetParameter', 'ssm:GetParameters'],
                    Resource: `arn:aws:ssm:eu-west-1:${awsaccountid}:parameter/${'${self:custom.smtpUsernameSsmKey}'}`
                  },
                  {
                    Effect: 'Allow',
                    Action: ['ssm:GetParameter', 'ssm:GetParameters'],
                    Resource: `arn:aws:ssm:eu-west-1:${awsaccountid}:parameter/${'${self:custom.smtpPasswordSsmKey}'}`
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
