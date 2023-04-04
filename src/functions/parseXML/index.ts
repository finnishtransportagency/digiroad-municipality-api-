import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  maximumRetryAttempts: 0,
  events: [
    {
      s3: {
        bucket: `dr-kunta-${process.env.STAGE_NAME}-bucket`,
        event: 's3:ObjectCreated:*',
        existing: true,
        rules: [{ prefix: 'infrao/' }]
      }
    }
  ],
  role: 'parseXMLRole'
};
