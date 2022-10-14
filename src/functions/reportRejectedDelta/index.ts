import { handlerPath } from '@libs/handler-resolver';
import { SSM } from 'aws-sdk';
const getParameter = async (name: string): Promise<string> => {
  const ssm = new SSM();
  const result = await ssm
    .getParameter({ Name: name, WithDecryption: true })
    .promise();
  return result.Parameter.Value;
};

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  package: { include: ['src/**/*.ejs'] },
  enviorment: {
    SMTP_USERNAME: getParameter(process.env.SMTP_USERNAME_SSM_KEY),
    SMTP_PASSWORD: getParameter(process.env.SMTP_PASSWORD_SSM_KEY),
    MUNICIPALITY_EMAIL: process.env.MUNICIPALITY_EMAIL,
    OPERATOR_EMAIL: process.env.OPERATOR_EMAIL
  }
};
