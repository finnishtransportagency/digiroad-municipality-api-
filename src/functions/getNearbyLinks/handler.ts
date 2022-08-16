import { middyfy } from '@libs/lambda';
import { Client } from 'pg';
import { parse } from 'wellknown';
import { LineString4D, LinkPoint } from '@functions/typing';

const gerNearbyLinks = async (event) => {
  var conn = 'postgres://digiroad2:PASSWORD@localhost:5432/digiroad2';
  var client = new Client(conn);
  await client.connect();
  const params = {
    features: event
  };
  const query = {
    text: `
    SELECT (value#>'{properties}'->>'ID')::DECIMAL AS ID, json_agg((st_astext(shape),linkid)) AS roadlinks
    FROM json_array_elements(($1)::json->'features') AS features, roadlink
    WHERE ST_BUFFER(ST_SETSRID(ST_GeomFromGeoJSON(features->>'geometry'), 3067), 20) && roadlink.shape
    GROUP BY ID
    `,
    values: [params]
  };
  return client
    .query(query)
    .then((res) => {
      res.rows.forEach((row) => {
        row.id = Number(row.id);
        row.roadlinks.forEach((roadlink) => {
          const feature = parse(
            roadlink.f1.replace('LINESTRING ZM', 'LINESTRING')
          );
          if (feature.type === 'LineString') {
            const coordinates = feature.coordinates as unknown as LineString4D;
            const pointObjects: Array<LinkPoint> = coordinates.map(
              (coordinate) => {
                return {
                  x: coordinate[0],
                  y: coordinate[1],
                  z: coordinate[2],
                  m: coordinate[3]
                };
              }
            );

            roadlink.linkId = roadlink.f2;
            roadlink.points = pointObjects;
            delete roadlink.f1;
            delete roadlink.f2;
          }
        });
      });
      client.end();
      return res.rows;
    })
    .catch((e) => {
      client.end();
      console.log(e);
      return;
    });
};

export const main = middyfy(gerNearbyLinks);
