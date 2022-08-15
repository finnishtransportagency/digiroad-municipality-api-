import { middyfy } from '@libs/lambda';
import { Client } from 'pg';

const storeMunicipalityData = async (event) => {
  var conn = 'postgres://digiroad2:PASSWORD@localhost:5432/digiroad2';
  var client = new Client(conn);
  if (event === '') {
    event = {
      x: 371067.460682820994407,
      y: 6675521.71858474612236
    };
  } else {
    event = JSON.parse(event);
  }
  client.connect();
  const query = {
    text: `
    WITH ref_point AS (
      SELECT ST_SetSRID(ST_Point($1, $2),3067) AS geom
    )
    
    SELECT linkid, ST_AsGeoJSON(shape)
      FROM roadlink, ref_point
    WHERE ST_BUFFER(ref_point.geom, 70) && roadlink.shape
    `,
    values: [event.x, event.y]
  };

  const res = await client.query(query);
  let resultingGeoJSON = '';
  for (let i = 0; i < res.rowCount; i++) {
    const element = res.rows[i];
    resultingGeoJSON = resultingGeoJSON.concat(
      '{ "type": "Feature", "properties": {}, geometry: '
    );
    resultingGeoJSON = resultingGeoJSON.concat(element.st_asgeojson);
    resultingGeoJSON = resultingGeoJSON.concat(',');
  }
  console.log(resultingGeoJSON);
  console.log('Connected to local DB');
  console.log(JSON.stringify(event));
  return;
};

export const main = middyfy(storeMunicipalityData);
