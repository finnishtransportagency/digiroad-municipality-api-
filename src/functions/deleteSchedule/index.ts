import { stage } from '@functions/config';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  maximumRetryAttempts: 0,

  role: 'deleteScheduleRole',
  events: [
    {
      http: {
        method: 'delete',
        path: 'admin/remove/{municipality}',
        private: stage === 'dev'
      }
    }
  ]
};
