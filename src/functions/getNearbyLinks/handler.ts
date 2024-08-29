import { middyfy } from '@libs/lambda-tools';
import { Geometry, LineString } from 'wkx';
import { bucketName } from '@functions/config';
import { getFromS3, uploadToS3 } from '@libs/s3-tools';
import { isGetNearbyLinksPayload, S3KeyObject } from '@customTypes/eventTypes';
import { gnlPayloadSchema } from '@schemas/getNearbyLinksSchema';
import { getPointQuery, getAreaQuery, executeSingleQuery } from '@libs/pg-tools';
import { pointQueryResultSchema } from '@schemas/sqlResultSchemas';

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

  const query =
    payload.assetType === 'roadSurfaces'
      ? getAreaQuery(payload.municipality, payload.features)
      : getPointQuery(payload.municipality, payload.features);

  const queryResultRows = (await executeSingleQuery(query)).rows
    .map((row) => {
      try {
        const parsedRow = pointQueryResultSchema.cast(row);
        return {
          ...parsedRow,
          roadlinks: parsedRow.roadlinks.map((roadlink) => {
            return {
              // TODO: Area roadlinks are not supported yet. Check history for the code snippet below
              /**
               * if (payload.assetType === 'roadSurfaces') {
               *  roadlink.geometrylength = roadlink.f3;
               * }
               */
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

  const now = new Date().toISOString().slice(0, 19);

  const S3ObjectKey = `getNearbyLinks/${payload.municipality}/${now}.json`;
  await uploadToS3(bucketName, S3ObjectKey, JSON.stringify(queryResultRows));

  return { key: S3ObjectKey };
};

export const main = middyfy(getNearbyLinks);
