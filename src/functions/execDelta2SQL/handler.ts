import { middyfy } from '@libs/lambda';
import { Client } from 'pg';

//https://stackoverflow.com/questions/34990186/how-do-i-properly-insert-multiple-rows-into-pg-with-node-postgres

const execDelta2SQL = async (event) => {
  const connection = 'postgres://digiroad2:digiroad2@localhost:5432/digiroad2';

  const client = new Client(connection);
  client.connect();

  const execCreated = async (feature, client) => {
    const assetQuery = {
      text: `
      INSERT INTO asset (id, external_id, asset_type_id, municipality_code, created_date, geometry) 
      VALUES ($1, $2, $3, $4, $5, $6);
      `,
      values: [
        `nextval('PRIMARY_KEY_SEQ')`,
        feature.ID,
        220,
        49,
        'CURRENT_TIMESTAMP',
        null
      ]
    };
    await client.query(assetQuery);

    const assetLinkQuery = {
      text: `
      INSERT INTO asset_link (asset_id, position_id)
      VALUES ($1, $2)`,
      values: [
        `curval('PRIMARY_KEY_SEQ')`,
        `nextval('LRM_POSITION_PRIMARY_KEY_SEQ')`
      ]
    };
    await client.query(assetLinkQuery);

    const lrmPositionQuery = {
      text: `
      INSERT INTO lrm_position (id, start_mesure, end_mesure, link_id)
      VALUES ($1, $2, $3, $4)
      `,
      values: [
        `curval('LRM_POSITION_PRIMARY_KEY')`,
        feature.properties.DR_M_VALUE,
        feature.properties.DR_M_VALUE,
        feature.properties.DR_LINK_ID
      ]
    };
    await client.query(lrmPositionQuery);

    console.log('hello');
  };

  try {
    await client.query('BEGIN');
    for (const feature of event.Created) {
      execCreated(feature, client);
    }
    //exec deleted
    //exec updated ( possibly delete + create)
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    client.end();
    console.log('ROLLBACK');
    return error;
  }

  client.end();
  return;
};

export const main = middyfy(execDelta2SQL);
