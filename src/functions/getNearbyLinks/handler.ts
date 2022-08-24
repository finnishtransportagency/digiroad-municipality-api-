import { middyfy } from '@libs/lambda';
import { Client } from 'pg';
import { parse } from 'wellknown';
import { LineString4D, LinkPoint } from '@functions/typing';

const gerNearbyLinks = async (event) => {
  const client = new Client({
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD
  });
  await client.connect();

  const query = {
    text: `
    WITH municipality_ AS (
      SELECT id
      FROM municipality
      WHERE LOWER(name_fi) = LOWER($1)
    ), acceptable_roadlinks AS (
      SELECT linkid, shape
      FROM roadlink, municipality_
      WHERE roadlink.municipalitycode = municipality_.id AND (roadlink.adminclass = 2 OR roadlink.adminclass = 3 OR roadlink.adminclass IS NULL)
    )

    
    SELECT (value#>'{properties}'->>'ID')::NUMERIC AS ID, json_agg((st_astext(shape),linkid)) AS roadlinks
    FROM json_array_elements($2) AS features, acceptable_roadlinks
    WHERE ST_BUFFER(ST_SETSRID(ST_GeomFromGeoJSON(features->>'geometry'), 3067), 20) && acceptable_roadlinks.shape 
    GROUP BY ID
    `,
    values: [event.municipality, JSON.stringify(event.features)]
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
          if (feature?.type === 'LineString') {
            const coordinates =
              feature.coordinates as unknown as Array<LineString4D>;
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
