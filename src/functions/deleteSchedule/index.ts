import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  role: 'deleteSchedulesRole',
  events: [
    {
      http: {
        method: 'delete',
        path: 'admin/remove/{municipality}'
      }
    }
  ]
};
