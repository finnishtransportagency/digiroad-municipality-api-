import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
     schedule: {
      rate: ['cron(0 0 12 ? * TUE *)']
     }
    }
  ]
};
