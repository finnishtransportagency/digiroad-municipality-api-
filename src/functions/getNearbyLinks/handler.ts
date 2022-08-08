import { middyfy } from '@libs/lambda';

const storeMunicipalityData = async (event) => {
  console.log(JSON.stringify(event));
  return;
};

export const main = middyfy(storeMunicipalityData);
