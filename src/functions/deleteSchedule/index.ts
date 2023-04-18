import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  role: 'deleteScheduleRole',
  events: [
    {
      http: {
        method: 'delete',
        path: 'admin/remove/{municipality}'
      }
    }
  ]
};
