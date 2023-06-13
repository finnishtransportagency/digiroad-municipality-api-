import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  maximumRetryAttempts: 0,
  package: { include: ['src/**/*.ejs'] },
  environment: {
    SMTP_USERNAME_SSM_KEY: process.env.SMTP_USERNAME_SSM_KEY,
    SMTP_PASSWORD_SSM_KEY: process.env.SMTP_PASSWORD_SSM_KEY
  },
  role: 'reportRejectedDeltaRole'
};
