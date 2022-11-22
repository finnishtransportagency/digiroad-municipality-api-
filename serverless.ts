import type { AWS } from '@serverless/typescript';

import {
  storeMunicipalityData,
  calculateDelta,
  matchRoadLink,
  reportRejectedDelta,
  getNearbyLinks,
  fetchEmailRecipient,
  execDelta2SQL
} from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'DRKunta',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    endpointType: 'PRIVATE',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      STAGE_NAME: process.env.STAGE_NAME,
      OPERATOR_EMAIL: process.env.OPERATOR_EMAIL,
      DIGIROADSECURITYGROUPID: process.env.DIGIROADSECURITYGROUPID,
      DIGIROADSUBNETAID: process.env.DIGIROADSUBNETAID,
      DIGIROADSUBNETBID: process.env.DIGIROADSUBNETBID
    },
    region: 'eu-west-1',
    vpc: {
      securityGroupIds: [process.env.SECURITYGROUPID],
      subnetIds: [process.env.SUBNETAID, process.env.SUBNETBID]
    },
    iam: {
      deploymentRole: `arn:aws:iam::${process.env.AWS_ACCOUNT_ID}:role/CloudFormationExecutionRole`,
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              's3:PutObject',
              's3:PutObjectAcl',
              's3:ListBucket',
              's3:GetObject',
              's3:DeleteObject'
            ],
            Resource: `arn:aws:s3:::dr-kunta-${process.env.STAGE_NAME}-bucket/*`
          },
          {
            Effect: 'Allow',
            Action: ['s3:ListBucket'],
            Resource: `arn:aws:s3:::dr-kunta-${process.env.STAGE_NAME}-bucket`
          },
          {
            Effect: 'Allow',
            Action: ['lambda:InvokeFunction'],
            Resource: `arn:aws:lambda:eu-west-1:${process.env.AWS_ACCOUNT_ID}:function:DRKunta-${process.env.STAGE_NAME}-calculateDelta`
          }
        ]
      }
    }
  },
  // import the function via paths
  functions: {
    storeMunicipalityData,
    calculateDelta,
    matchRoadLink,
    reportRejectedDelta,
    getNearbyLinks,
    fetchEmailRecipient,
    execDelta2SQL
  },
  resources: {
    Resources: {
      drKuntaBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: `dr-kunta-${process.env.STAGE_NAME}-bucket`
        }
      },
      calculateDeltaRole: {
        Type: 'AWS::IAM::Role',
        Properties: {
          RoleName: `DRKunta-${process.env.STAGE_NAME}-calculateDeltaRole`,
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
              PolicyName: `DRKunta-${process.env.STAGE_NAME}-calculateDeltaPolicy`,
              PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                  {
                    Effect: 'Allow',
                    Action: [
                      's3:PutObject',
                      's3:PutObjectAcl',
                      's3:ListBucket',
                      's3:GetObject',
                      's3:DeleteObject'
                    ],
                    Resource: `arn:aws:s3:::dr-kunta-${process.env.STAGE_NAME}-bucket/*`
                  },
                  {
                    Effect: 'Allow',
                    Action: ['s3:ListBucket'],
                    Resource: `arn:aws:s3:::dr-kunta-${process.env.STAGE_NAME}-bucket`
                  },
                  {
                    Effect: 'Allow',
                    Action: ['lambda:InvokeFunction'],
                    Resource: `arn:aws:lambda:eu-west-1:${process.env.AWS_ACCOUNT_ID}:function:DRKunta-${process.env.STAGE_NAME}-matchRoadLink`
                  },
                  {
                    Effect: 'Allow',
                    Action: ['lambda:InvokeFunction'],
                    Resource: `arn:aws:lambda:eu-west-1:${process.env.AWS_ACCOUNT_ID}:function:DRKunta-${process.env.STAGE_NAME}-reportRejectedDelta`
                  },
                  {
                    Effect: 'Allow',
                    Action: [
                      'logs:CreateLogGroup',
                      'logs:CreateLogStream',
                      'logs:PutLogEvents'
                    ],
                    Resource: `arn:aws:logs:eu-west-1:${process.env.AWS_ACCOUNT_ID}:log-group:/aws/lambda/*`
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
          RoleName: `DRKunta-${process.env.STAGE_NAME}-DBLambdaRole`,
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
              PolicyName: `DRKunta-${process.env.STAGE_NAME}-DBLambdaPolicy`,
              PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                  {
                    Effect: 'Allow',
                    Action: ['ssm:GetParameter', 'ssm:GetParameters'],
                    Resource: `arn:aws:ssm:eu-west-1:${process.env.AWS_ACCOUNT_ID}:parameter/*`
                  },
                  {
                    Effect: 'Allow',
                    Action: [
                      'logs:CreateLogGroup',
                      'logs:CreateLogStream',
                      'logs:PutLogEvents'
                    ],
                    Resource: `arn:aws:logs:eu-west-1:${process.env.AWS_ACCOUNT_ID}:log-groups:/aws/lambda/*:*:*`
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
          RoleName: `DRKunta-${process.env.STAGE_NAME}-matchRoadLinkRole`,
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
              PolicyName: `DRKunta-${process.env.STAGE_NAME}-matchRoadLinkPolicy`,
              PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                  {
                    Effect: 'Allow',
                    Action: ['lambda:InvokeFunction'],
                    Resource: `arn:aws:lambda:eu-west-1:${process.env.AWS_ACCOUNT_ID}:function:DRKunta-${process.env.STAGE_NAME}-reportRejectedDelta`
                  },
                  {
                    Effect: 'Allow',
                    Action: ['lambda:InvokeFunction'],
                    Resource: `arn:aws:lambda:eu-west-1:${process.env.AWS_ACCOUNT_ID}:function:DRKunta-${process.env.STAGE_NAME}-getNearbyLinks`
                  },
                  {
                    Effect: 'Allow',
                    Action: ['lambda:InvokeFunction'],
                    Resource: `arn:aws:lambda:eu-west-1:${process.env.AWS_ACCOUNT_ID}:function:DRKunta-${process.env.STAGE_NAME}-execDelta2SQL`
                  },
                  {
                    Effect: 'Allow',
                    Action: [
                      'logs:CreateLogGroup',
                      'logs:CreateLogStream',
                      'logs:PutLogEvents'
                    ],
                    Resource: `arn:aws:logs:eu-west-1:${process.env.AWS_ACCOUNT_ID}:log-groups:/aws/lambda/*:*:*`
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
          RoleName: `DRKunta-${process.env.STAGE_NAME}-reportRejectedDeltaRole`,
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
              PolicyName: `DRKunta-${process.env.STAGE_NAME}-reportRejectedDeltaPolicy`,
              PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                  {
                    Effect: 'Allow',
                    Action: ['lambda:InvokeFunction'],
                    Resource: `arn:aws:lambda:eu-west-1:${process.env.AWS_ACCOUNT_ID}:function:DRKunta-${process.env.STAGE_NAME}-fetchEmailRecipient`
                  },
                  {
                    Effect: 'Allow',
                    Action: [
                      'logs:CreateLogGroup',
                      'logs:CreateLogStream',
                      'logs:PutLogEvents'
                    ],
                    Resource: `arn:aws:logs:eu-west-1:${process.env.AWS_ACCOUNT_ID}:log-groups:/aws/lambda/*:*:*`
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
                    Resource: `arn:aws:s3:::dr-kunta-${process.env.STAGE_NAME}-bucket/*`
                  },
                  {
                    Effect: 'Allow',
                    Action: ['ssm:GetParameter', 'ssm:GetParameters'],
                    Resource: `arn:aws:ssm:eu-west-1:${process.env.AWS_ACCOUNT_ID}:parameter/*`
                  }
                ]
              }
            }
          ]
        }
      }
    }
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10
    }
  }
};

module.exports = serverlessConfiguration;
