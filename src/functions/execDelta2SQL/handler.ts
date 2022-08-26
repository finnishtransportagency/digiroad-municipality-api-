import { middyfy } from '@libs/lambda';
import { Client } from 'pg';

import execCreated from './execCreated';
import execDeleted from './execDeleted';
import execUpdated from './execUpdated';

const execDelta2SQL = async (event) => {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'digiroad2',
    user: 'digiroad2',
    password: 'digiroad2'
  });
  client.connect();

  try {
    await client.query('BEGIN');

    for (const feature of event.Created) {
      await execCreated(feature, client);
    }

    for (const feature of event.Updated) {
      await execUpdated(feature, client);
    }
    /*
    for (const feature of event.Deleted) {
      execDeleted(feature, client);
    }
    */

    await client.query('COMMIT');
    console.log('commited');
  } catch (error) {
    await client.query('ROLLBACK');
    client.end();
    console.log('Database error, rolling back: ', error);
    return;
  }

  client.end();
  return;
};

export const main = middyfy(execDelta2SQL);
