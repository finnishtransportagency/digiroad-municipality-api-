import { middyfy } from '@libs/lambda-tools';
import { Geometry, LineString } from 'wkx';
import { bucketName } from '@functions/config';
import { deleteFromS3, getFromS3, now, uploadToS3 } from '@libs/s3-tools';
import {
  isGetNearbyLinksPayload,
  S3KeyObject,
  SupportedMunicipality
} from '@customTypes/eventTypes';
import { gnlPayloadSchema } from '@schemas/getNearbyLinksSchema';
import { getPointQuery, executeSingleQuery } from '@libs/pg-tools';
import { pointQueryResultSchema } from '@schemas/sqlResultSchemas';
import { municipalityCodeMap } from '@schemas/dbIdMapping';

const getNearbyLinks = async (event: S3KeyObject): Promise<S3KeyObject> => {
  try {
    const s3Response = JSON.parse(await getFromS3(bucketName, event.key)) as unknown;
    const payload = gnlPayloadSchema.cast(s3Response);
    if (!isGetNearbyLinksPayload(payload))
      throw new Error(
        `S3 object ${
          event.key
        } is not valid GetNearbyLinksPayload object:\n${JSON.stringify(payload).slice(
          0,
          1000
        )}`
      );

    const municipality: SupportedMunicipality = payload.municipality;
    const municipalityCode = municipality ? municipalityCodeMap[municipality] : undefined;

    if (!municipalityCode)
      throw new Error(`Municipality ${payload.municipality} is not supported`);

    const queryResultRows = (
      await executeSingleQuery(getPointQuery(municipalityCode, payload.features))
    ).rows
      .map((row) => {
        try {
          const parsedRow = pointQueryResultSchema.cast(row);
          return {
            ...parsedRow,
            roadlinks: parsedRow.roadlinks.map((roadlink) => {
              return {
                linkId: roadlink.f2,
                points: (Geometry.parse(`SRID=3067;${roadlink.f1}`) as LineString).points,
                directiontype: roadlink.f3,
                roadname: roadlink.f4
              };
            })
          };
        } catch (e) {
          console.error('Error in mapping:', e);
          return 'INVALID';
        }
      })
      .filter((row) => row !== 'INVALID');

    const S3ObjectKey = `getNearbyLinks/${payload.municipality}/${now()}.json`;

    console.info(`Uploading to S3: ${S3ObjectKey}`);

    await uploadToS3(bucketName, S3ObjectKey, JSON.stringify(queryResultRows));

    console.info('Upload complete');

    return { key: S3ObjectKey };
  } catch (error) {
    console.error(`Error in getNearbyLinks: ${(error as Error).message}`);

    const deleteKey = `geojson/${event.key.split('/')[1]}/${event.key.split('/')[2]}/${
      event.key.split('/')[3]
    }`;

    try {
      await deleteFromS3(bucketName, deleteKey);
      console.log(`Deleted ${deleteKey} due to getNearbyLinks failure.`);
    } catch (deleteError) {
      console.error(`Failed to delete ${deleteKey}: ${(deleteError as Error).message}`);
    }

    throw error;
  }
};

export const main = middyfy(getNearbyLinks);
