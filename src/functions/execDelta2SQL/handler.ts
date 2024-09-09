import { middyfy } from '@libs/lambda-tools';

import execCreatedObstacle from './execObstacle/execCreated';
import execExpiredObstacle from './execObstacle/execExpired';
import execUpdatedObstacle from './execObstacle/execUpdated';

import execCreatedTrafficSign from './execTrafficSign/execCreated';
import execUpdatedTrafficSign from './execTrafficSign/execUpdated';
import execExpiredTrafficSign from './execTrafficSign/execExpired';

import { bucketName } from '@functions/config';
import { getFromS3 } from '@libs/s3-tools';
import { getPostgresClient } from '@libs/pg-tools';

const execDelta2SQL = async (event) => {
  const data = await getFromS3(bucketName, event.key);
  const delta = JSON.parse(data) as unknown;

  const client = await getPostgresClient();
  await client.connect();

  const municipality: string = delta.metadata.municipality;

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
    switch (delta.metadata.assetType) {
      case 'obstacles':
        for (const feature of delta.Created) {
          await execCreatedObstacle(feature, municipality_code, dbmodifier, client);
        }
        for (const feature of delta.Deleted) {
          await execExpiredObstacle(feature, municipality_code, dbmodifier, client);
        }
        for (const feature of delta.Updated) {
          await execUpdatedObstacle(feature, municipality_code, dbmodifier, client);
        }
        break;
      case 'trafficSigns':
        for (const feature of delta.Created) {
          await execCreatedTrafficSign(feature, municipality_code, dbmodifier, client);
        }
        for (const feature of delta.Deleted) {
          await execExpiredTrafficSign(feature, municipality_code, dbmodifier, client);
        }
        for (const feature of delta.Updated) {
          await execUpdatedTrafficSign(feature, municipality_code, dbmodifier, client);
        }
        break;
      default:
        throw new Error('Invalid assetType');
    }

    await client.query('COMMIT');
  } catch (e: unknown) {
    await client.query('ROLLBACK');
    await client.end();
    console.error('Database error, rolling back: ', e);
    return;
  }

  await client.end();
  return;
};

export const main = middyfy(execDelta2SQL);
