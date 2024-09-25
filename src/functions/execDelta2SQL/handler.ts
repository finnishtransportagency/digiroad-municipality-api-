import { middyfy } from '@libs/lambda-tools';

import execCreatedObstacle from './execObstacle/execCreated';
import execExpiredObstacle from './execObstacle/execExpired';
import execUpdatedObstacle from './execObstacle/execUpdated';

import execCreatedTrafficSign from './execTrafficSign/execCreated';
import execUpdatedTrafficSign from './execTrafficSign/execUpdated';
import execExpiredTrafficSign from './execTrafficSign/execExpired';

import { bucketName } from '@functions/config';
import { getFromS3 } from '@libs/s3-tools';
import { executeTransaction, getPostgresClient } from '@libs/pg-tools';
import { isUpdatePayload, S3KeyObject } from '@customTypes/eventTypes';
import { updatePayloadSchema } from '@schemas/updatePayloadSchema';

const execDelta2SQL = async (event: S3KeyObject) => {
  const s3Response = JSON.parse(await getFromS3(bucketName, event.key)) as unknown;
  const delta = updatePayloadSchema.cast(s3Response);
  if (!isUpdatePayload(delta))
    throw new Error(
      `S3 object ${event.key} is not valid UpdatePayload object:\n${JSON.stringify(
        delta
      ).slice(0, 1000)}`
    );
  console.log('delta:');

  const client = await getPostgresClient();
  await client.connect();

  const municipality: string = delta.metadata.municipality;

  const dbmodifier = `municipality-api-${municipality}`;

  const queryFunctions = 

  await executeTransaction(queryFunctions, (e) => console.error(e));

  /* try {
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
  return; */
};

export const main = middyfy(execDelta2SQL);
