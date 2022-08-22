import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  vpc: {
    subnetIds: [process.env.DIGIROADSUBNETAID, process.env.DIGIROADSUBNETBID]
  },
  environment: {
    PGHOST: process.env.PGHOST,
    PGUSER: process.env.PGUSER,
    PGPASSWORD: process.env.PGPASSWORD,
    PGPORT: process.env.PGPORT
  }
};
