import { middyfy } from '@libs/lambda';

const reportRejectedData = async (event) => {
  console.log(JSON.stringify(event));
  return;
};

export const main = middyfy(reportRejectedData);
