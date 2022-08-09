import { middyfy } from '@libs/lambda';

const execDelta2SQL = async (event) => {
  console.log(JSON.stringify(event));
  return;
};

export const main = middyfy(execDelta2SQL);
