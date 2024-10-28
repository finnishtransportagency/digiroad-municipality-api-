import {
  awsaccountid,
  bucketName,
  email,
  smtppassword,
  smtpusername
} from '@functions/config';
import { handlerPath } from '@libs/handler-resolver';
import { ServerlessFunction } from 'serverless';

const reportRejectedDelta: ServerlessFunction = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  maximumRetryAttempts: 0,
  timeout: 300,
  package: { include: ['src/**/*.ejs'] },
  environment: {
    OPERATOR_EMAIL: email,
    SMTP_USERNAME_SSM_KEY: smtpusername,
    SMTP_PASSWORD_SSM_KEY: smtppassword
  },
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: [
        's3:PutObject',
        's3:PutObjectAcl',
        's3:ListBucket',
        's3:GetObject',
        's3:DeleteObject'
      ],
      Resource: [`arn:aws:s3:::${bucketName}/*`]
    },
    {
      Effect: 'Allow',
      Action: ['ssm:DescribeParameters'],
      Resource: [`arn:aws:ssm:eu-west-1:${awsaccountid}:*`]
    },
    {
      Effect: 'Allow',
      Action: ['ssm:GetParameter', 'ssm:GetParameters'],
      Resource: [
        `arn:aws:ssm:eu-west-1:${awsaccountid}:parameter/${'${self:custom.smtpUsernameSsmKey}'}`,
        `arn:aws:ssm:eu-west-1:${awsaccountid}:parameter/${'${self:custom.smtpPasswordSsmKey}'}`
      ]
    }
  ]
};

export default reportRejectedDelta;
