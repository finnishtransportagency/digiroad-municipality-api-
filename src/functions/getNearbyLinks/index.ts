import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  vpc: {
    securityGroupIds: [process.env.DIGIROADSECURITYGROUPID],
    subnetIds: [process.env.DIGIROADSUBNETAID, process.env.DIGIROADSUBNETBID]
  }
};
