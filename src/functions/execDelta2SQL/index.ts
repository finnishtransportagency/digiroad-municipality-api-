import { handlerPath } from '@libs/handler-resolver';
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

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  maximumRetryAttempts: 0,
  timeout: 300,
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
  }
};
