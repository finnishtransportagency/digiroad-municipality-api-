import {
  offline,
  pgdatabase,
  pghost,
  pgpassword,
  pgport,
  pguser
} from '@functions/config';
import { Client } from 'pg';
import { getParameter } from './ssm-tools';
import { ValidFeature } from '@customTypes/featureTypes';
import { allowedOnKapy } from '@schemas/trafficSignTypes';

interface PostgresQuery {
  text: string;
  values: Array<string | Array<string>>;
}

export const getPostgresClient = async () => {
  return new Client({
    host: pghost,
    port: pgport,
    database: pgdatabase,
    user: pguser,
    password: offline ? pgpassword : await getParameter(pgpassword)
  });
};

/**
 * Initializes a connection to the database, executes the query and closes the connection.
 * @param query - The query to be executed
 * @returns The response from the database
 */
export const executeSingleQuery = async (query: PostgresQuery) => {
  const client = await getPostgresClient();
  await client.connect();
  const response = await client.query(query);
  await client.end();
  return response;
};

/**
 * TODO: Verify query & write description
 *
 * @example result row:
 * // {
 * //  id: '392852548',
 * //  type: 'TRAFFICSIGN',
 * //  roadlinks: [
 * //   {
 * //    f1: 'LINESTRING ZM (375846.234 6678667.548 39.223 0,375831.028 6678696.81 40.456 32.977,375824.863 6678702.376 40.727 41.283)',
 * //    f2: 'ad0e3c7c-dab2-4f60-be21-81d994a5458b:1',
 * //    f3: 1,
 * //    f4: 'Lähderannantie'
 * //   }
 * //  ]
 * // }
 */
export const getPointQuery = (
  municipality: string,
  features: Array<ValidFeature>
): PostgresQuery => {
  return {
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
    values: [municipality, JSON.stringify(features), allowedOnKapy]
  };
};

/**
 * TODO: Verify query & write description
 */
export const getAreaQuery = (municipality: string, features: Array<ValidFeature>) => {
  return {
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
    values: [municipality, JSON.stringify(features)]
  };
};
