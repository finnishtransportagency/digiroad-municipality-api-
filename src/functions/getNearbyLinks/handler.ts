import { middyfy } from '@libs/lambda';
import { SSM, GetParameterCommand } from '@aws-sdk/client-ssm';
import { Client, QueryResult } from 'pg';
import { Geometry, LineString, Point } from 'wkx';

const getParameter = async (name: string): Promise<string> => {
  const ssm = new SSM({});
  const getParametersCommand = new GetParameterCommand({
    Name: name,
    WithDecryption: true
  });
  const result = await ssm.send(getParametersCommand);
  return result.Parameter.Value;
};

const gerNearbyLinks = async (event) => {
  const client = new Client({
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT),
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: await getParameter(process.env.PGPASSWORD_SSM_KEY)
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
      FROM kgv_roadlink, municipality_
      WHERE kgv_roadlink.municipalitycode = municipality_.id AND not EXISTS(
      SELECT 1
      FROM administrative_class 
      WHERE administrative_class.link_id = kgv_roadlink.linkid and administrative_class.administrative_class = 1
      ) and (kgv_roadlink.adminclass != 1 OR kgv_roadlink.adminclass is NULL)
    )
    
    
    SELECT (value#>'{properties}'->>'ID')::TEXT AS ID, (value#>'{properties}'->>'TYPE')::TEXT AS TYPE, json_agg((st_astext(shape),linkid)) AS roadlinks
    FROM json_array_elements($2) AS features, acceptable_roadlinks
    WHERE ST_BUFFER(ST_SETSRID(ST_GeomFromGeoJSON(features->>'geometry'), 3067), 10) && acceptable_roadlinks.shape 
    GROUP BY ID,TYPE
    `,
    values: [event.municipality, JSON.stringify(event.features)]
  };
  return client
    .query(query)
    .then((res: QueryResult) => {
      res.rows.forEach((row) => {
        row.roadlinks.forEach((roadlink) => {
          const feature = Geometry.parse(
            `SRID=3067;${roadlink.f1}`
          ) as LineString;
          const pointObjects: Array<Point> = feature.points;
          roadlink.linkId = roadlink.f2;
          roadlink.points = pointObjects;
          delete roadlink.f1;
          delete roadlink.f2;
        });
      });
      client.end();
      return res.rows;
    })
    .catch((error) => {
      client.end();
      console.error('Query failed:', error);
      return;
    });
};

export const main = middyfy(gerNearbyLinks);
