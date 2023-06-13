import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  maximumRetryAttempts: 0,
  timeout: 300,
  vpc: {
    securityGroupIds: [process.env.DIGIROADSECURITYGROUPID],
    subnetIds: [process.env.DIGIROADSUBNETAID, process.env.DIGIROADSUBNETBID]
  },
  environment: {
    PGHOST: process.env.PGHOST,
    PGUSER: process.env.PGUSER,
    PGPASSWORD_SSM_KEY: process.env.PGPASSWORD_SSM_KEY,
    PGPORT: process.env.PGPORT,
    PGDATABASE: process.env.PGDATABASE
  },
  role: 'DBLambdaRole'
};
