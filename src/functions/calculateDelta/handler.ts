import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const calculateDelta: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log("CalculateDelta invoked")
  return formatJSONResponse({
    message: `calculateDelta ${event.body.name}, welcome to the exciting Serverless world!`,
    event,
  });
};

export const main = middyfy(calculateDelta);
