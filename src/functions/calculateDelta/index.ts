import { stage } from '@functions/config';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  maximumRetryAttempts: 0,
  timeout: 300,
  memorySize: 4096,
  events: [
    {
      s3: {
        bucket: `dr-kunta-${stage}-bucket-placeholder`,
        event: 's3:ObjectCreated:*',
        rules: [{ prefix: 'geojson/' }]
      }
    }
  ]
};
