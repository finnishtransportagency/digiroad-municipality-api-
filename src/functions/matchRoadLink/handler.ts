import { invokeLambda, middyfy } from '@libs/lambda-tools';

import { getFromS3, uploadToS3 } from '@libs/s3-tools';
import { bucketName, MAX_OFFSET } from '@functions/config';
import {
  GetNearbyLinksPayload,
  isS3KeyObject,
  isUpdatePayload,
  S3KeyObject,
  UpdatePayload
} from '@customTypes/eventTypes';
import { ValidFeature } from '@customTypes/featureTypes';
import { updatePayloadSchema } from '@schemas/updatePayloadSchema';
import { featureNearbyLinksSchema } from '@schemas/featureNearbyLinksSchema';
import matchFeature from './matchFeature';

const now = new Date().toISOString().slice(0, 19);

const matchRoadLinks = async (event: S3KeyObject) => {
  const s3Response = JSON.parse(await getFromS3(bucketName, event.key)) as unknown;
  const updatePayload = updatePayloadSchema.cast(s3Response);
  if (!isUpdatePayload(updatePayload))
    throw new Error(
      `S3 object ${event.key} is not valid UpdatePayload object:\n${JSON.stringify(
        updatePayload
      ).slice(0, 1000)}`
    );

  const getNearbyLinksPayload: GetNearbyLinksPayload = {
    features: updatePayload.Created.concat(updatePayload.Updated),
    municipality: updatePayload.metadata.municipality,
    assetType: updatePayload.metadata.assetType
  };

  await uploadToS3(
    bucketName,
    `getNearbyLinksRequestPayload/${updatePayload.metadata.municipality}/${now}.json`,
    JSON.stringify(getNearbyLinksPayload)
  );

  const invocationResult = Buffer.from(
    (
      await invokeLambda(
        'getNearbyLinks',
        'RequestResponse',
        Buffer.from(
          JSON.stringify({
            key: `getNearbyLinksRequestPayload/${updatePayload.metadata.municipality}/${now}.json`
          })
        )
      )
    ).Payload || 'getNearbyLinks Payload was undefined'
  ).toString();

  const parsedResult = JSON.parse(invocationResult) as unknown;
  if (!isS3KeyObject(parsedResult)) {
    throw new Error(
      `getNearbyLinks lambda invocation result is not valid S3KeyObject:\n${JSON.stringify(
        parsedResult
      )}`
    );
  }
  const allRoadLinksS3Key = parsedResult.key;

  const allRoadLinks = JSON.parse(
    await getFromS3(bucketName, allRoadLinksS3Key)
  ) as unknown;
  if (!Array.isArray(allRoadLinks))
    throw new Error(
      `S3 object ${allRoadLinksS3Key} is not valid Array<FeatureRoadlinkMap>`
    );
  const nearbyLinksList = allRoadLinks.map((link) => featureNearbyLinksSchema.cast(link));

  let rejectsAmount = 0;
  const mapMatches = (feature: ValidFeature) => {
    const nearbyLinks = nearbyLinksList.find(
      (link) => link.id === feature.properties.ID && link.type === feature.properties.TYPE
    );
    if (!nearbyLinks)
      return { ...feature, properties: { ...feature.properties, DR_REJECTED: true } };

    const match = matchFeature(feature, nearbyLinks.roadlinks);
    if (!match || (match && match.properties.DR_REJECTED)) rejectsAmount++;
    return match;
  };
  const createdFeatures = updatePayload.Created.map(mapMatches);
  const updatedFeatures = updatePayload.Updated.map(mapMatches);

  const execDelta2SQLBody: UpdatePayload = {
    Created: createdFeatures.filter((feature) => !feature.properties.DR_REJECTED),
    Updated: updatedFeatures.filter((feature) => !feature.properties.DR_REJECTED),
    Deleted: updatePayload.Deleted,
    metadata: {
      municipality: updatePayload.metadata.municipality,
      assetType: updatePayload.metadata.assetType
    }
  };

  const logsBody = {
    Rejected: {
      Created: createdFeatures.filter((feature) => feature.properties.DR_REJECTED),
      Updated: updatedFeatures.filter((feature) => feature.properties.DR_REJECTED)
    },
    Accepted: {
      Created: updatePayload.Created.filter((feature) => !feature.properties.DR_REJECTED),
      Deleted: updatePayload.Deleted,
      Updated: updatedFeatures.filter((feature) => !feature.properties.DR_REJECTED)
    },
    invalidInfrao: updatePayload.invalidInfrao,
    metadata: {
      OFFSET_LIMIT: MAX_OFFSET,
      municipality: updatePayload.metadata.municipality,
      assetType: updatePayload.metadata.assetType
    }
  };

  await uploadToS3(
    bucketName,
    `matchRoadLink/${updatePayload.metadata.municipality}/${now}.json`,
    JSON.stringify(execDelta2SQLBody)
  );

  await uploadToS3(
    bucketName,
    `logs/${updatePayload.metadata.municipality}/${now}.json`,
    JSON.stringify(logsBody)
  );

  await invokeLambda(
    'execDelta2SQL',
    'Event',
    Buffer.from(
      JSON.stringify({
        key: `matchRoadLink/${updatePayload.metadata.municipality}/${now}.json`
      })
    )
  );

  const reportRejectedDeltabody = {
    assetType: updatePayload.metadata.assetType,
    rejectsAmount: rejectsAmount,
    assetsAmount: updatePayload.Created.length + updatePayload.Updated.length,
    deletesAmount: updatePayload.Deleted.length,
    invalidInfrao: updatePayload.invalidInfrao,
    now: now
  };

  await invokeLambda(
    'reportRejectedDelta',
    'Event',
    Buffer.from(
      JSON.stringify({
        ReportType:
          rejectsAmount > 0 || updatePayload.invalidInfrao.sum > 0
            ? 'matchedWithFailures'
            : 'matchedSuccessfully',
        Municipality: updatePayload.metadata.municipality,
        Body: reportRejectedDeltabody
      })
    )
  );
};

export const main = middyfy(matchRoadLinks);
