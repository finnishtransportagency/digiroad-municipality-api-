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

  try {
    await client.query('BEGIN');

    for (const feature of event.Created) {
      await execCreated(feature, client);
    }
    for (const feature of event.Deleted) {
      await execDeleted(feature, client);
    }
    for (const feature of event.Updated) {
      await execUpdated(feature, client);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    client.end();
    console.log('Database error, rollbacking: ', error);
    return;
  }

  client.end();
  return;
};

export const main = middyfy(execDelta2SQL);
