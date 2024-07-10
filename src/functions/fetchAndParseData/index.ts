import { handlerPath } from '@libs/handler-resolver';

// This is the serverless configuration file for the fetchAndParseData function
export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  maximumRetryAttempts: 0,
  timeout: 60
};
