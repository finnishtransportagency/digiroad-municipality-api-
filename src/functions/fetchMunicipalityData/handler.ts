import { middyfy } from '@libs/lambda';
import { SSM, GetParameterCommand } from '@aws-sdk/client-ssm';

const getParameter = async (name: string): Promise<string> => {
  const ssm = new SSM({});
  const getParametersCommand = new GetParameterCommand({
    Name: name,
    WithDecryption: true
  });
  const result = await ssm.send(getParametersCommand);
  return result.Parameter.Value;
};

const fetchMunicipalityData = async (event) => {
  const municipality: string = event.municipality;
  const apiKey = await getParameter(event.authentication);
  const url = event.url;
  const result = {
    municipality: municipality,
    apiKey: apiKey,
    url: url
  };
  console.log(result);
};

export const main = middyfy(fetchMunicipalityData);
