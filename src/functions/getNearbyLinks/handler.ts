import { middyfy } from '@libs/lambda';
import { SSM, GetParameterCommand } from '@aws-sdk/client-ssm';
import { GetObjectCommand, S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Client } from 'pg';
import { Geometry, LineString, Point } from 'wkx';
import { offline, pghost, pgport, pgdatabase, pguser, pgpassword } from '@functions/config';

const allowedOnKapy = [
  'A11 Tietyö',
  'A21 Tienristeys',
  'A33 Muu vaara',
  'B5 Väistämisvelvollisuus risteyksessä',
  'B6 Pakollinen pysäyttäminen',
  'C2 Moottorikäyttöisellä ajoneuvolla ajo kielletty',
  'C21 Ajoneuvon suurin sallittu leveys',
  'C22 Ajoneuvon suurin sallittu korkeus',
  'C24 Ajoneuvon suurin sallittu massa',
  'D4 Jalkakäytävä',
  'D5 Pyörätie',
  'D6 Yhdistetty pyörätie ja jalkakäytävä',
  'D7.1 Pyörätie ja jalkakäytävä rinnakkain',
  'D7.2 Pyörätie ja jalkakäytävä rinnakkain',
  'E26 Kävelykatu',
  'E27 Kävelykatu päättyy',
  'F16 Osoiteviitta',
  'F19 Jalankulun viitta',
  'F20.1 Pyöräilyn viitta',
  'F20.2 Pyöräilyn viitta',
  'F21.1 Pyöräilyn suunnistustaulu',
  'F21.2 Pyöräilyn suunnistustaulu',
  'F22 Pyöräilyn etäisyystaulu',
  'F23 Pyöräilyn paikannimi',
  'F50.9 Polkupyörälle tarkoitettu reitti',
  'F52 Jalankulkijalle tarkoitettu reitti',
  'F53 Esteetön reitti',
  'F54.1 Reitti, jolla on portaat alas',
  'F54.2 Reitti, jolla on portaat ylös',
  'F55.1 Reitti ilman portaita alas',
  'F55.2 Reitti ilman portaitaylös',
  'F55.3 Pyörätuoliramppi alas',
  'F55.4 Pyörätuoliramppi ylös',
  'F56.1 Hätäuloskäynti vasemmalla',
  'F56.2 Hätäuloskäynti oikealla',
  'F57.1 Poistumisreitti (yksi)',
  'F57.2 Poistumisreitti (useita)',
  'H23.1 Kaksisuuntainen pyörätie',
  'H23.2 Kaksisuuntainen pyörätie',
  'H24 Tekstillinen lisäkilpi',
  'H25 Huoltoajo sallittu'
];
const getParameter = async (name: string): Promise<string> => {
  const ssm = new SSM({});
  const getParametersCommand = new GetParameterCommand({
    Name: name,
    WithDecryption: true
  });
  const result = await ssm.send(getParametersCommand);
  return result.Parameter.Value;
};

const s3config = offline
  ? {
      forcePathStyle: true,
      credentials: {
        accessKeyId: 'S3RVER', // This specific key is required when working offline
        secretAccessKey: 'S3RVER'
      },
      endpoint: 'http://localhost:4569'
    }
  : {};
const s3 = new S3(s3config);
const getNearbyLinks = async (event) => {
  const getObjectParams = {
    Bucket: `dr-kunta-${process.env.STAGE_NAME}-bucket`,
    Key: event.key
  };
  const getObjectsCommand = new GetObjectCommand(getObjectParams);
  const data = await s3.send(getObjectsCommand);
  const object = await data.Body.transformToString();
  const requestPayload = JSON.parse(object);

  const client = new Client({
    host: pghost,
    port: parseInt(pgport),
    database: pgdatabase,
    user: pguser,
    password: await getParameter(pgpassword)
  });
  await client.connect();

  const pointQuery = {
    text: `
    WITH municipality_ AS (
      SELECT id
      FROM municipality
      WHERE LOWER(name_fi) = LOWER($1)
      ), 
      acceptable_roadlinks AS (
        SELECT linkid, shape, directiontype, functional_class, roadname_fi
        FROM kgv_roadlink, municipality_, functional_class
        WHERE kgv_roadlink.municipalitycode = municipality_.id AND kgv_roadlink.linkid = functional_class.link_id AND not EXISTS(
        SELECT 1
        FROM administrative_class 
        WHERE administrative_class.link_id = kgv_roadlink.linkid AND administrative_class.administrative_class = 1
        ) AND (kgv_roadlink.adminclass != 1 OR kgv_roadlink.adminclass IS NULL)
      )
      
      SELECT (value#>'{properties}'->>'ID')::TEXT AS ID, (value#>'{properties}'->>'TYPE')::TEXT AS TYPE,json_agg((st_astext(shape),linkid,directiontype, roadname_fi)) AS roadlinks
      FROM json_array_elements($2) AS features, acceptable_roadlinks
      WHERE ST_BUFFER(ST_SETSRID(ST_GeomFromGeoJSON(features->>'geometry'), 3067), 5) && acceptable_roadlinks.shape 
        AND ((features#>'{properties}'->>'TYPE') != 'TRAFFICSIGN' OR (features#>'{properties}'->>'LM_TYYPPI') = ANY(($3)::text[]) OR acceptable_roadlinks.functional_class != 8)
      GROUP BY ID,TYPE
      `,
    values: [
      requestPayload.municipality,
      JSON.stringify(requestPayload.features),
      allowedOnKapy
    ]
  };
  const areaQuery = {
    text: `
    WITH municipality_ AS (
      SELECT id
      FROM municipality
      WHERE LOWER(name_fi) = LOWER($1)
      ), 
      acceptable_roadlinks AS (
        SELECT linkid, shape, geometrylength
        FROM kgv_roadlink, municipality_
        WHERE kgv_roadlink.municipalitycode = municipality_.id AND not EXISTS(
        SELECT 1
        FROM administrative_class 
        WHERE administrative_class.link_id = kgv_roadlink.linkid AND administrative_class.administrative_class = 1
        ) AND (kgv_roadlink.adminclass != 1 OR kgv_roadlink.adminclass IS NULL)
      )
      
      SELECT (value#>'{properties}'->>'ID')::TEXT AS ID, (value#>'{properties}'->>'TYPE')::TEXT AS TYPE,json_agg((st_astext(shape),linkid,geometrylength)) AS roadlinks
      FROM json_array_elements($2) AS features, acceptable_roadlinks
      WHERE ST_SETSRID(ST_GeomFromGeoJSON(features->>'geometry'), 3067) && acceptable_roadlinks.shape 
      GROUP BY ID,TYPE
      `,
    values: [
      requestPayload.municipality,
      JSON.stringify(requestPayload.features)
    ]
  };
  const query =
    requestPayload.assetType === 'roadSurfaces' ? areaQuery : pointQuery;

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
      if (requestPayload.assetType === 'roadSurfaces') {
        roadlink.geometrylength = roadlink.f3;
      } else {
        roadlink.directiontype = roadlink.f3;
        roadlink.roadname = roadlink.f4;
        delete roadlink.f3;
        delete roadlink.f4;
      }
    });
  });

  const now = new Date().toISOString().slice(0, 19);
  const S3ObjectKey = `getNearbyLinks/${requestPayload.municipality}/${now}.json`;
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
