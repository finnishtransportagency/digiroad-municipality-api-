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
  vpc: {
    securityGroupIds: [process.env.DIGIROADSECURITYGROUPID],
    subnetIds: [process.env.DIGIROADSUBNETAID, process.env.DIGIROADSUBNETBID]
  },
  environment: {
    PGHOST: process.env.PGHOST,
    PGUSER: process.env.PGUSER,
    PGPASSWORD: getParameter(process.env.PGPASSWORD_SSM_KEY),
    PGPORT: process.env.PGPORT,
    PGDATABASE: process.env.PGDATABASE
  }
};
