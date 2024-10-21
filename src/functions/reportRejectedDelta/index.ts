import { smtppassword, smtpusername } from '@functions/config';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  maximumRetryAttempts: 0,
  timeout: 300,
  package: { include: ['src/**/*.ejs'] },
  environment: {
    SMTP_USERNAME_SSM_KEY: smtpusername,
    SMTP_PASSWORD_SSM_KEY: smtppassword
  },
  role: 'reportRejectedDeltaRole'
};
