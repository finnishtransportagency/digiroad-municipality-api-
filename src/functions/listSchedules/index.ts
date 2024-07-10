import { stage } from '@functions/config';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  maximumRetryAttempts: 0,
  events: [
    {
      http: {
        method: 'get',
        path: 'admin/list',
        private: stage === 'dev'
      }
    }
  ]
};
