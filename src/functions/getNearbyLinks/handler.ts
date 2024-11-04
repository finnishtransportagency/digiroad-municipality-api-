import { middyfy } from '@libs/lambda-tools';
import { Geometry, LineString } from 'wkx';
import { bucketName } from '@functions/config';
import { getFromS3, uploadToS3 } from '@libs/s3-tools';
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

  const S3ObjectKey = `getNearbyLinks/${payload.municipality}/${new Date()
    .toISOString()
    .slice(0, 19)}.json`;

  console.info(`Uploading to S3: ${S3ObjectKey}`);

  await uploadToS3(bucketName, S3ObjectKey, JSON.stringify(queryResultRows));

  console.info('Upload complete');

  return { key: S3ObjectKey };
};

export const main = middyfy(getNearbyLinks);
