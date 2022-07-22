import { middyfy } from '@libs/lambda';

const reportRejectedDelta = async (event) => {
  console.log(`reportRejectedDelta invoked. Event: ${JSON.stringify(event)}`);

  return JSON.stringify('hello from reject');
};

export const main = middyfy(reportRejectedDelta);
