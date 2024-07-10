import { stage } from '@functions/config';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  maximumRetryAttempts: 0,
  role: 'createScheduleRole',
  events: [
    {
      http: {
        method: 'post',
        path: 'admin/add',
        private: stage === 'dev'
      }
    }
  ]
};
