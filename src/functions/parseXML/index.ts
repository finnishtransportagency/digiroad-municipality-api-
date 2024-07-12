import { stage } from '@functions/config';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  maximumRetryAttempts: 0,
  timeout: 120,
  events: [
    {
      s3: {
        bucket: `dr-kunta-${stage}-bucket-placeholder`,
        event: 's3:ObjectCreated:*',
        rules: [{ prefix: 'infrao/' }]
      }
    }
  ]
};
