import { middyfy } from '@libs/lambda-tools';
import { bucketName } from '@functions/config';
import { getFromS3 } from '@libs/s3-tools';
import { executeTransaction } from '@libs/pg-tools';
import { isUpdatePayload, S3KeyObject } from '@customTypes/eventTypes';
import { updatePayloadSchema } from '@schemas/updatePayloadSchema';
import execInsert from './execInsert';
import { municipalityCodeMap } from '@schemas/dbIdMapping';
import { Client } from 'pg';
import { QueryFunction } from '@customTypes/pgTypes';
import execDelete from './execDelete';

const execDelta2SQL = async (event: S3KeyObject) => {
  const s3Response = JSON.parse(await getFromS3(bucketName, event.key)) as unknown;
  const delta = updatePayloadSchema.cast(s3Response);
  if (!isUpdatePayload(delta))
    throw new Error(
      `S3 object ${event.key} is not valid UpdatePayload object:\n${JSON.stringify(
        delta
      ).slice(0, 1000)}`
    );

  const municipality = delta.metadata.municipality;
  const municipalityCode = municipalityCodeMap[municipality];
  const dbmodifier = `municipality-api-${municipality}`;

  const queryFunctions = delta.Created.concat(delta.Updated)
    .map((feature): QueryFunction => {
      return async (client: Client) =>
        await execInsert(feature, municipalityCode, dbmodifier, client);
    })
    .concat(
      delta.Deleted.map((feature): QueryFunction => {
        return async (client: Client) =>
          await execDelete(feature, municipalityCode, dbmodifier, client);
      })
    );

  await executeTransaction(queryFunctions, (e) => console.error(e));
};

export const main = middyfy(execDelta2SQL);
