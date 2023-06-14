import { middyfy } from '@libs/lambda';
import { SSM, GetParameterCommand } from '@aws-sdk/client-ssm';
import { S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Client } from 'pg';
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

const s3 = new S3({});
const getNearbyLinks = async (event) => {
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
      SELECT linkid, shape, directiontype
      FROM kgv_roadlink, municipality_
      WHERE kgv_roadlink.municipalitycode = municipality_.id AND not EXISTS(
      SELECT 1
      FROM administrative_class 
      WHERE administrative_class.link_id = kgv_roadlink.linkid and administrative_class.administrative_class = 1
      ) and (kgv_roadlink.adminclass != 1 OR kgv_roadlink.adminclass is NULL)
    )
    
    
    SELECT (value#>'{properties}'->>'ID')::TEXT AS ID, (value#>'{properties}'->>'TYPE')::TEXT AS TYPE, json_agg((st_astext(shape),linkid,directiontype)) AS roadlinks
    FROM json_array_elements($2) AS features, acceptable_roadlinks
    WHERE ST_BUFFER(ST_SETSRID(ST_GeomFromGeoJSON(features->>'geometry'), 3067), 5) && acceptable_roadlinks.shape 
    GROUP BY ID,TYPE
    `,
    values: [event.municipality, JSON.stringify(event.features)]
  };

  const res = await client.query(query);
  client.end();

  res.rows.forEach((row) => {
    row.roadlinks.forEach((roadlink) => {
      const feature = Geometry.parse(`SRID=3067;${roadlink.f1}`) as LineString;
      const pointObjects: Array<Point> = feature.points;
      roadlink.linkId = roadlink.f2;
      roadlink.points = pointObjects;
      delete roadlink.f1;
      delete roadlink.f2;
    });
  });

  const now = new Date().toISOString().slice(0, 19);
  const S3ObjectKey = `getNearbyLinks/${event.municipality}/${now}.json`;
  const putParams = {
    Bucket: `dr-kunta-${process.env.STAGE_NAME}-bucket`,
    Key: S3ObjectKey,
    Body: JSON.stringify(res.rows)
  };

  await new Upload({
    client: s3,
    params: putParams
  }).done();

  return { key: S3ObjectKey };
};

export const main = middyfy(getNearbyLinks);
