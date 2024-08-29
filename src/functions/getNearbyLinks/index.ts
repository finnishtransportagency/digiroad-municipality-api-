import {
  drsecuritygroupid,
  drsubnetid1,
  drsubnetid2,
  pgdatabase,
  pghost,
  pgpassword,
  pgport,
  pguser
} from '@functions/config';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  maximumRetryAttempts: 0,
  timeout: 60,
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
  role: 'DBLambdaRole'
};
