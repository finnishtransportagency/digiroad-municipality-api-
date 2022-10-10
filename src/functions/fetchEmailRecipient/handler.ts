import { middyfy } from '@libs/lambda';
import { Client } from 'pg';

const fetchEmailRecipient = async (event) => {
  const client = new Client({
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT),
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD
  });
  await client.connect();

  const municipality_code: number = parseInt(
    (
      await client.query({
        text: `
          SELECT id
          FROM municipality
          WHERE LOWER(name_fi) = LOWER($1)
          `,
        values: [event.municipality]
      })
    ).rows[0].id
  );
  const getEmailQuery = {
    text: `
      SELECT email_address
      FROM  municipality_email
      WHERE municipality_code=($1)
    `,
    values: [municipality_code]
  };

  const getEmailResult = await client.query(getEmailQuery);
  client.end();
  const result = getEmailResult.rows.map((a) => a.email_address);
  return result;
};

export const main = middyfy(fetchEmailRecipient);
