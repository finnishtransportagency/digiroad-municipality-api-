import { middyfy } from '@libs/lambda';

const fetchMunicipalityData = async (event) => {
  console.log(event);
};

export const main = middyfy(fetchMunicipalityData);
