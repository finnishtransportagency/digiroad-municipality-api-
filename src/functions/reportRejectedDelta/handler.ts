import { middyfy } from '@libs/lambda';

const reportRejectedDelta = async (event) => {
  console.log(`matchRoadLinks invoked. Event: ${JSON.stringify(event)}`);

  return JSON.stringify('hello from reject');
};

export const main = middyfy(reportRejectedDelta);
