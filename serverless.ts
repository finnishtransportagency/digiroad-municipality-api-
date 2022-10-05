import type { AWS } from '@serverless/typescript';

import {
  storeMunicipalityData,
  calculateDelta,
  matchRoadLink,
  reportRejectedDelta,
  getNearbyLinks,
  reportRejectedData,
  execDelta2SQL
} from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'digiroad-municipality-api',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      STAGE_NAME: process.env.STAGE_NAME,
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
            Resource: `arn:aws:lambda:eu-west-1:475079312496:function:digiroad-municipality-api-${process.env.STAGE_NAME}-calculateDelta`
          },
          {
            Effect: 'Allow',
            Action: ['lambda:InvokeFunction'],
            Resource: `arn:aws:lambda:eu-west-1:475079312496:function:digiroad-municipality-api-${process.env.STAGE_NAME}-matchRoadLink`
          },
          {
            Effect: 'Allow',
            Action: ['lambda:InvokeFunction'],
            Resource: `arn:aws:lambda:eu-west-1:475079312496:function:digiroad-municipality-api-${process.env.STAGE_NAME}-reportRejectedDelta`
          },
          {
            Effect: 'Allow',
            Action: ['lambda:InvokeFunction'],
            Resource: `arn:aws:lambda:eu-west-1:475079312496:function:digiroad-municipality-api-${process.env.STAGE_NAME}-getNearbyLinks`
          },
          {
            Effect: 'Allow',
            Action: ['lambda:InvokeFunction'],
            Resource: `arn:aws:lambda:eu-west-1:475079312496:function:digiroad-municipality-api-${process.env.STAGE_NAME}-execDelta2SQL`
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
    reportRejectedData,
    execDelta2SQL
  },
  resources: {
    Resources: {
      drKuntaBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: `dr-kunta-${process.env.STAGE_NAME}-bucket`
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
