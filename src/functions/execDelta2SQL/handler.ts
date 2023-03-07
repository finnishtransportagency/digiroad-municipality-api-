import { middyfy } from '@libs/lambda';
import { SSM } from 'aws-sdk';
import { Client } from 'pg';

import execCreatedObstacle from './execObstacle/execCreated';
import execExpiredObstacle from './execObstacle/execExpired';
import execUpdatedObstacle from './execObstacle/execUpdated';

import execCreatedTrafficSign from './execTrafficSign/execCreated';
import execUpdatedTrafficSign from './execTrafficSign/execUpdated';
import execExpiredTrafficSign from './execTrafficSign/execExpired';

const getParameter = async (name: string): Promise<string> => {
  const ssm = new SSM();
  const result = await ssm
    .getParameter({ Name: name, WithDecryption: true })
    .promise();
  return result.Parameter.Value;
};

const execDelta2SQL = async (event) => {
  const client = new Client({
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT),
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: await getParameter(process.env.PGPASSWORD_SSM_KEY)
  });
  client.connect();

  const municipality: string = event.metadata.municipality;

  const dbmodifier = `municipality-api-${municipality}`;

  try {
    await client.query('BEGIN');
    const municipality_code: number = parseInt(
      (
        await client.query({
          text: `
            SELECT id
            FROM municipality
            WHERE LOWER(name_fi) = LOWER($1)
            `,
          values: [municipality]
        })
      ).rows[0].id
    );

    for (const feature of event.Created) {
      if (feature.properties.TYPE === 'OBSTACLE') {
        await execCreatedObstacle(
          feature,
          municipality_code,
          dbmodifier,
          client
        );
      }
      if (feature.properties.TYPE === 'TRAFFICSIGN') {
        await execCreatedTrafficSign(
          feature,
          municipality_code,
          dbmodifier,
          client
        );
      }
    }
    for (const feature of event.Deleted) {
      if (feature.properties.TYPE === 'OBSTACLE') {
        await execExpiredObstacle(
          feature,
          municipality_code,
          dbmodifier,
          client
        );
      }
      if (feature.properties.TYPE === 'TRAFFICSIGN') {
        await execExpiredTrafficSign(
          feature,
          municipality_code,
          dbmodifier,
          client
        );
      }
    }
    for (const feature of event.Updated) {
      if (feature.properties.TYPE === 'OBSTACLE') {
        await execUpdatedObstacle(
          feature,
          municipality_code,
          dbmodifier,
          client
        );
      }
      if (feature.properties.TYPE === 'TRAFFICSIGN') {
        await execUpdatedTrafficSign(
          feature,
          municipality_code,
          dbmodifier,
          client
        );
      }
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    client.end();
    console.error('Database error, rolling back: ', error);
    return;
  }

  client.end();
  return;
};

export const main = middyfy(execDelta2SQL);
