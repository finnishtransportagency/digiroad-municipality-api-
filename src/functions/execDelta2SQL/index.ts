import { handlerPath } from '@libs/handler-resolver';
import {
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
    securityGroupIds: ['${self:custom.drSecurityGroupId}'],
    subnetIds: ['${self:custom.drSubnetId1}', '${self:custom.drSubnetId2}']
  },
  environment: {
    PGHOST: pghost,
    PGUSER: pguser,
    PGPASSWORD_SSM_KEY: pgpassword,
    PGPORT: pgport,
    PGDATABASE: pgdatabase
  }
};
