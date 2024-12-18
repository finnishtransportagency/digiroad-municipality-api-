import { invokeLambda, middyfy } from '@libs/lambda-tools';

import { getFromS3, uploadToS3 } from '@libs/s3-tools';
import {
  bucketName,
  MAX_OFFSET_OBSTACLES,
  MAX_OFFSET_SIGNS,
  stage
} from '@functions/config';
import {
  GetNearbyLinksPayload,
  isS3KeyObject,
  isMatchedPayload,
  S3KeyObject,
  MatchedPayload
} from '@customTypes/eventTypes';
import { InvalidFeature, MatchedFeature, ValidFeature } from '@customTypes/featureTypes';
import { updatePayloadSchema } from '@schemas/updatePayloadSchema';
import { featureNearbyLinksSchema } from '@schemas/featureNearbyLinksSchema';
import matchFeature from './matchFeature';
import { invalidFeature } from '@libs/schema-tools';

const matchRoadLinks = async (event: S3KeyObject) => {
  const fileName = event.key.split('/')[2].split('.')[0];
  const s3Response = JSON.parse(await getFromS3(bucketName, event.key)) as unknown;
  const updatePayload = updatePayloadSchema.cast(s3Response);
  if (!isMatchedPayload(updatePayload))
    throw new Error(
      `S3 object ${event.key} is not valid UpdatePayload object:\n${JSON.stringify(
        updatePayload
      ).slice(0, 1000)}`
    );

  const municipality = updatePayload.metadata.municipality;
  const assetType = updatePayload.metadata.assetType;

  const getNearbyLinksPayload: GetNearbyLinksPayload = {
    features: updatePayload.Created.concat(updatePayload.Updated),
    municipality,
    assetType
  };

  await uploadToS3(
    bucketName,
    `getNearbyLinksRequestPayload/${municipality}/${fileName}.json`,
    JSON.stringify(getNearbyLinksPayload)
  );

  const invocationResult = Buffer.from(
    (
      await invokeLambda(
        'getNearbyLinks',
        'RequestResponse',
        Buffer.from(
          JSON.stringify({
            key: `getNearbyLinksRequestPayload/${municipality}/${fileName}.json`
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

  /**
   * Matches closest road link for each feature. Used in Array.prototype.map().
   * @param feature
   * @returns Feature with closest link params.
   */
  const mapMatches = (feature: ValidFeature): MatchedFeature | InvalidFeature => {
    const nearbyLinks = nearbyLinksList.find(
      (link) => link.id === feature.properties.ID && link.type === feature.properties.TYPE
    );
    if (!nearbyLinks) return invalidFeature(feature, 'No links close enough to asset.');

    const match = matchFeature(feature, nearbyLinks.roadlinks);
    if (!match || (match && match.type === 'Invalid')) rejectsAmount++;
    return match;
  };
  const createdFeatures = updatePayload.Created.map(mapMatches);
  const updatedFeatures = updatePayload.Updated.map(mapMatches);

  const execDelta2SQLBody: MatchedPayload = {
    Created: createdFeatures.filter(
      (feature): feature is MatchedFeature => feature.type === 'Feature'
    ),
    Updated: updatedFeatures.filter(
      (feature): feature is MatchedFeature => feature.type === 'Feature'
    ),
    Deleted: updatePayload.Deleted,
    invalidInfrao: updatePayload.invalidInfrao,
    metadata: {
      municipality,
      assetType
    }
  };

  const rejectedCreated = createdFeatures.filter((feature) => feature.type === 'Invalid');
  const rejectedUpdated = updatedFeatures.filter((feature) => feature.type === 'Invalid');
  const acceptedCreated = createdFeatures.filter((feature) => feature.type === 'Feature');
  const acceptedUpdated = updatedFeatures.filter((feature) => feature.type === 'Feature');

  const logsBody = {
    Rejected: {
      createdSum: rejectedCreated.length,
      updatedSum: rejectedUpdated.length,
      Created: rejectedCreated,
      Updated: rejectedUpdated
    },
    Accepted: {
      createdSum: acceptedCreated.length,
      updatedSum: acceptedUpdated.length,
      deletedSum: updatePayload.Deleted.length,
      Created: acceptedCreated,
      Updated: acceptedUpdated,
      Deleted: updatePayload.Deleted
    },
    invalidInfrao: updatePayload.invalidInfrao,
    metadata: {
      OFFSET_LIMIT: { signs: MAX_OFFSET_SIGNS, obstacles: MAX_OFFSET_OBSTACLES },
      municipality,
      assetType
    }
  };

  console.info('Assets rejected by matchRoadLink:', rejectsAmount);
  console.info('invalidInfrao sum:', updatePayload.invalidInfrao.sum);

  await uploadToS3(
    bucketName,
    `matchRoadLink/${municipality}/${fileName}.json`,
    JSON.stringify(execDelta2SQLBody)
  );

  await uploadToS3(
    bucketName,
    `logs/${municipality}/${fileName}.json`,
    JSON.stringify(logsBody)
  );

  await invokeLambda(
    'execDelta2SQL',
    'Event',
    Buffer.from(
      JSON.stringify({
        key: `matchRoadLink/${municipality}/${fileName}.json`
      })
    )
  );

  await invokeLambda(
    'reportRejectedDelta',
    'Event',
    Buffer.from(
      JSON.stringify({
        Municipality: municipality,
        Body: {
          assetType,
          rejectsAmount,
          assetsAmount: updatePayload.Created.length + updatePayload.Updated.length,
          deletesAmount: updatePayload.Deleted.length,
          invalidInfraoSum: updatePayload.invalidInfrao.sum,
          now: fileName,
          stage: stage,
          link: `https://s3.console.aws.amazon.com/s3/object/${bucketName}?region=eu-west-1&prefix=logs/${municipality}/${fileName}.json`
        },
        S3Key: `logs/${municipality}/${fileName}.json`
      })
    )
  );
};

export const main = middyfy(matchRoadLinks);
