import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  role: 'listSchedulesRole',
  events: [
    {
      http: {
        method: 'get',
        path: 'admin/list',
        private: true
      }
    }
  ]
};
