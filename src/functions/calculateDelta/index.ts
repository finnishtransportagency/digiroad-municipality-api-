import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: 
    [{ s3: { bucket: 'drKuntaDevBucket', event: 's3:ObjectCreated:*', existing: true } }],
};
