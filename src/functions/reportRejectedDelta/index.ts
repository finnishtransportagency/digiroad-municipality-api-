import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  package: { include: ['src/**/*.ejs'] },
  environment: {
    SMTP_USERNAME_SSM_KEY: process.env.SMTP_USERNAME_SSM_KEY,
    SMTP_PASSWORD_SSM_KEY: process.env.SMTP_PASSWORD_SSM_KEY
  },
  role: 'reportRejectedDeltaRole'
};
