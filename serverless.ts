import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';
import importData from '@functions/importData';

const serverlessConfiguration: AWS = {
  service: 'digiroad-municipality-api',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    region: 'eu-west-1',
    vpc: {
      securityGroupIds: [process.env.SECURITYGROUPID],
      subnetIds: [
        process.env.SUBNETAID,
        process.env.SUBNETBID
      ]
    }
  },
  // import the function via paths
  functions: { importData },
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
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
