import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  role: 'createScheduleRole',
  events: [
    {
      http: {
        method: 'post',
        path: 'admin/add',
        private: true
      }
    }
  ]
};
