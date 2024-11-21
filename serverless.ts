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
  serviceName,
  stage,
  drsecuritygroupid,
  drsubnetid1,
  drsubnetid2,
  securitygroupid,
  subnetid1,
  subnetid2,
  pgpassword,
  pghost,
  pgport,
  pgdatabase,
  pguser,
  bucketName
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

const tags = [
  {
    Key: 'Name',
    Value: serviceName
  },
  {
    Key: 'Environment',
    Value: stage
  },
  {
    Key: 'Administrator',
    Value: '${env:ADMINISTRATOR}'
  }
];

const serverlessConfiguration: ServerlessConfiguration = {
  service: serviceName,
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
    drSubnetId1: offline ? drsubnetid1 : `\${ssm:${drsubnetid1}}`,
    drSubnetId2: offline ? drsubnetid2 : `\${ssm:${drsubnetid2}}`,
    drSecurityGroupId: offline ? drsecuritygroupid : `\${ssm:${drsecuritygroupid}}`,
    subnetId1: offline ? subnetid1 : `\${ssm:${subnetid1}}`,
    subnetId2: offline ? subnetid2 : `\${ssm:${subnetid2}}`,
    securityGroupId: offline ? securitygroupid : `\${ssm:${securitygroupid}}`,
    pgHost: offline ? pghost : `\${ssm:${pghost}}`,
    pgPort: offline ? pgport : `\${ssm:${pgport}}`,
    pgDatabase: offline ? pgdatabase : `\${ssm:${pgdatabase}}`,
    pgUser: offline ? pguser : `\${ssm:${pguser}}`,
    pgPasswordSsmKey: offline ? pgpassword : `\${ssm:${pgpassword}}`
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
      SERVICE_NAME: serviceName
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
    },
    stackTags: {
      Name: serviceName,
      Environment: stage,
      Administrator: '${env:ADMINISTRATOR}'
    },
    tags: {
      Name: serviceName,
      Environment: stage,
      Administrator: '${env:ADMINISTRATOR}'
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
      FetchAndParseDataLogGroup: {
        Type: 'AWS::Logs::LogGroup',
        Properties: {
          RetentionInDays: 180,
          Tags: tags
        }
      },
      CalculateDeltaLogGroup: {
        Type: 'AWS::Logs::LogGroup',
        Properties: {
          RetentionInDays: 180,
          Tags: tags
        }
      },
      MatchRoadLinkLogGroup: {
        Type: 'AWS::Logs::LogGroup',
        Properties: {
          RetentionInDays: 180,
          Tags: tags
        }
      },
      ReportRejectedDeltaLogGroup: {
        Type: 'AWS::Logs::LogGroup',
        Properties: {
          RetentionInDays: 180,
          Tags: tags
        }
      },
      GetNearbyLinksLogGroup: {
        Type: 'AWS::Logs::LogGroup',
        Properties: {
          RetentionInDays: 180,
          Tags: tags
        }
      },
      ExecDelta2SQLLogGroup: {
        Type: 'AWS::Logs::LogGroup',
        Properties: {
          RetentionInDays: 180,
          Tags: tags
        }
      },
      S3CanInvokeCalculateDelta: {
        Type: 'AWS::Lambda::Permission',
        Properties: {
          FunctionName: {
            'Fn::GetAtt': ['CalculateDeltaLambdaFunction', 'Arn']
          },
          Action: 'lambda:InvokeFunction',
          Principal: 's3.amazonaws.com',
          SourceArn: {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition'
                },
                `:s3:::\${self:service}-${stage}-bucket`
              ]
            ]
          },
          SourceAccount: {
            Ref: 'AWS::AccountId'
          }
        }
      },
      drKuntaBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: bucketName,
          LifecycleConfiguration: {
            Rules: [
              {
                ExpirationInDays: 30,
                Status: 'Enabled',
                TagFilters: [{ Key: 'ExpireIn30', Value: 'true' }]
              }
            ]
          },
          NotificationConfiguration: {
            LambdaConfigurations: [
              {
                Event: 's3:ObjectCreated:*',
                Filter: {
                  S3Key: {
                    Rules: [{ Name: 'prefix', Value: 'geojson/' }]
                  }
                },
                Function: { 'Fn::GetAtt': ['CalculateDeltaLambdaFunction', 'Arn'] }
              }
            ]
          },
          Tags: tags
        }
      }
    }
  },
  package: { individually: true }
};

module.exports = serverlessConfiguration;
