import { SSM, GetParameterCommand } from '@aws-sdk/client-ssm';

export const getParameter = async (name: string): Promise<string> => {
  const ssm = new SSM({});
  const getParametersCommand = new GetParameterCommand({
    Name: name,
    WithDecryption: true
  });
  const result = await ssm.send(getParametersCommand);
  if (result.Parameter?.Value === undefined)
    throw new Error(`Failed to get parameter "${name}"`);
  return result.Parameter.Value;
};
