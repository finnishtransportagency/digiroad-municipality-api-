import { middyfy } from '@libs/lambda';

const matchRoadLinks = async (event) => {
  console.log(`matchRoadLinks invoked. Event: ${JSON.stringify(event)}`);

  return JSON.stringify('hello from match');
};

export const main = middyfy(matchRoadLinks);
