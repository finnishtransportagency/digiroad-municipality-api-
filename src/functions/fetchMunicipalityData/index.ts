import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      schedule: {
        rate: ['cron(30 12 ? * TUE *)'],
        input: {
          municipality: 'espoo',
          url: 'url.com',
          user: 'kuntaUser',
          password: 'password123'
        }
      }
    }
  ]
};
