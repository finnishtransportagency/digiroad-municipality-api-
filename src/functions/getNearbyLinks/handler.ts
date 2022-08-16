import { middyfy } from '@libs/lambda';
import { Client } from 'pg';

const gerNearbyLinks = async (event) => {
  var conn = 'postgres://digiroad2:PASSWORD@localhost:5432/digiroad2'; //NOTE: Not the way we will connect to actual DB
  var client = new Client(conn);
  client.connect();
  const query = {
    text: `
    SELECT value#>'{properties}'->>'ID' AS ID, json_agg((st_astext(shape),linkid)) AS roadlinks
    FROM json_array_elements(($1)::json->'features') AS features, roadlink
    WHERE ST_BUFFER(ST_SETSRID(ST_GeomFromGeoJSON(features->>'geometry'), 3067), 20) && roadlink.shape
    GROUP BY ID
    `,
    values: [event]
  };
  const result = await client.query(query);
  client.end();
  return result.rows;
};

export const main = middyfy(gerNearbyLinks);
