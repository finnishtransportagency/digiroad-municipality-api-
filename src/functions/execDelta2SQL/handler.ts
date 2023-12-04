import { middyfy } from '@libs/lambda';
import { SSM, GetParameterCommand } from '@aws-sdk/client-ssm';
import { S3, GetObjectCommand } from '@aws-sdk/client-s3';
import { Client } from 'pg';

import execCreatedObstacle from './execObstacle/execCreated';
import execExpiredObstacle from './execObstacle/execExpired';
import execUpdatedObstacle from './execObstacle/execUpdated';

import execCreatedTrafficSign from './execTrafficSign/execCreated';
import execUpdatedTrafficSign from './execTrafficSign/execUpdated';
import execExpiredTrafficSign from './execTrafficSign/execExpired';

import execCreatedSurface from './execSurface/execCreated';
import execCleanUp from './execSurface/execCleanup';
import { offline, pghost, pgport, pgdatabase, pguser, pgpassword } from '@functions/config';

const getParameter = async (name: string): Promise<string> => {
  const ssm = new SSM({});
  const getParametersCommand = new GetParameterCommand({
    Name: name,
    WithDecryption: true
  });
  const result = await ssm.send(getParametersCommand);
  return result.Parameter.Value;
};
const s3config = offline
  ? {
      forcePathStyle: true,
      credentials: {
        accessKeyId: 'S3RVER', // This specific key is required when working offline
        secretAccessKey: 'S3RVER'
      },
      endpoint: 'http://localhost:4569'
    }
  : {};
const s3 = new S3(s3config);

const execDelta2SQL = async (event) => {
  const getObjectParams = {
    Bucket: `dr-kunta-${process.env.STAGE_NAME}-bucket`,
    Key: event.key
  };
  const getObjectsCommand = new GetObjectCommand(getObjectParams);
  const data = await s3.send(getObjectsCommand);
  const object = await data.Body.transformToString();
  const delta = JSON.parse(object);

  const client = new Client({
    host: pghost,
    port: parseInt(pgport),
    database: pgdatabase,
    user: pguser,
    password: await getParameter(pgpassword)
  });
  client.connect();

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
          await execCreatedObstacle(
            feature,
            municipality_code,
            dbmodifier,
            client
          );
        }
        for (const feature of delta.Deleted) {
          await execExpiredObstacle(
            feature,
            municipality_code,
            dbmodifier,
            client
          );
        }
        for (const feature of delta.Updated) {
          await execUpdatedObstacle(
            feature,
            municipality_code,
            dbmodifier,
            client
          );
        }
        break;
      case 'trafficSigns':
        for (const feature of delta.Created) {
          await execCreatedTrafficSign(
            feature,
            municipality_code,
            dbmodifier,
            client
          );
        }
        for (const feature of delta.Deleted) {
          await execExpiredTrafficSign(
            feature,
            municipality_code,
            dbmodifier,
            client
          );
        }
        for (const feature of delta.Updated) {
          await execUpdatedTrafficSign(
            feature,
            municipality_code,
            dbmodifier,
            client
          );
        }
        break;
      case 'roadSurfaces':
        if (delta.Created.length > 0 || delta.Deleted.length > 0) {
          await execCleanUp(municipality_code, dbmodifier, client);
          for (const feature of delta.Created) {
            await execCreatedSurface(
              feature,
              municipality_code,
              dbmodifier,
              client
            );
          }
        }
        break;
      default:
        throw new Error('Invalid assetType');
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
