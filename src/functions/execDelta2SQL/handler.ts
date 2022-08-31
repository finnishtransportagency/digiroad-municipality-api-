import { middyfy } from '@libs/lambda';
import { Client } from 'pg';

import execCreated from './execCreated';
import execDeleted from './execDeleted';
import execUpdated from './execUpdated';

const execDelta2SQL = async (event) => {
  const client = new Client({
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT),
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD
  });
  client.connect();

  const municipality: string = event.Body.metadata.municipality;

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

    for (const feature of event.Body.Created) {
      await execCreated(feature, municipality_code, client);
    }
    for (const feature of event.Body.Deleted) {
      await execDeleted(feature, municipality_code, client);
    }
    for (const feature of event.Body.Updated) {
      await execUpdated(feature, municipality_code, client);
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
