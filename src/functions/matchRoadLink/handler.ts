import { invokeLambda, middyfy } from '@libs/lambda-tools';

import { deleteFromS3, getFromS3, uploadToS3 } from '@libs/s3-tools';
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
import {
  InvalidFeature,
  isInvalidFeature,
  MatchedFeature,
  ValidFeature
} from '@customTypes/featureTypes';
import { updatePayloadSchema } from '@schemas/updatePayloadSchema';
import { featureNearbyLinksSchema } from '@schemas/featureNearbyLinksSchema';
import matchFeature from './matchFeature';
import { invalidFeature } from '@libs/schema-tools';

const matchRoadLinks = async (event: S3KeyObject) => {
  const fileName = event.key.split('/')[3].split('.')[0];
  try {
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
      `getNearbyLinksRequestPayload/${municipality}/${assetType}/${fileName}.json`,
      JSON.stringify(getNearbyLinksPayload)
    );

    const invocationResult = Buffer.from(
      (
        await invokeLambda(
          'getNearbyLinks',
          'RequestResponse',
          Buffer.from(
            JSON.stringify({
              key: `getNearbyLinksRequestPayload/${municipality}/${assetType}/${fileName}.json`
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
    const nearbyLinksList = allRoadLinks.map((link) =>
      featureNearbyLinksSchema.cast(link)
    );

    /**
     * Matches closest road link for each feature. Used in Array.prototype.map().
     * @param feature
     * @returns Feature with closest link params.
     */
    const mapMatches = (feature: ValidFeature): MatchedFeature | InvalidFeature => {
      const nearbyLinks = nearbyLinksList.find(
        (link) =>
          link.id === feature.properties.ID && link.type === feature.properties.TYPE
      );
      if (!nearbyLinks) return invalidFeature(feature, 'No links close enough to asset.');

      return matchFeature(feature, nearbyLinks.roadlinks);
    };
    const mappedCreated = updatePayload.Created.map(mapMatches);
    const mappedUpdated = updatePayload.Updated.map(mapMatches);
    const createdFeatures = mappedCreated.filter(
      (f): f is MatchedFeature => !isInvalidFeature(f)
    );
    const updatedFeatures = mappedUpdated.filter(
      (f): f is MatchedFeature => !isInvalidFeature(f)
    );

    const rejectedFeatures: Array<InvalidFeature> = mappedCreated
      .concat(mappedUpdated)
      .filter(isInvalidFeature);

    const execDelta2SQLBody: MatchedPayload = {
      Created: createdFeatures,
      Updated: updatedFeatures,
      Deleted: updatePayload.Deleted,
      metadata: {
        municipality,
        assetType
      }
    };

    const logsBody = {
      RejectedByLocation: {
        sum: rejectedFeatures.length,
        rejected: rejectedFeatures
      },
      Accepted: {
        createdSum: createdFeatures.length,
        updatedSum: updatedFeatures.length,
        deletedSum: updatePayload.Deleted.length,
        Created: createdFeatures,
        Updated: updatedFeatures,
        Deleted: updatePayload.Deleted
      },
      metadata: {
        OFFSET_LIMIT: { signs: MAX_OFFSET_SIGNS, obstacles: MAX_OFFSET_OBSTACLES },
        municipality,
        assetType
      }
    };

    console.info('Assets rejected by matchRoadLink:', rejectedFeatures.length);

    await uploadToS3(
      bucketName,
      `matchRoadLink/${municipality}/${assetType}/${fileName}.json`,
      JSON.stringify(execDelta2SQLBody)
    );

    await uploadToS3(
      bucketName,
      `logs/${municipality}/${assetType}/${fileName}.json`,
      JSON.stringify(logsBody)
    );

    await invokeLambda(
      'execDelta2SQL',
      'Event',
      Buffer.from(
        JSON.stringify({
          key: `matchRoadLink/${municipality}/${assetType}/${fileName}.json`
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
            rejectsAmount: rejectedFeatures.length,
            assetsAmount: updatePayload.Created.length + updatePayload.Updated.length,
            deletesAmount: updatePayload.Deleted.length,
            now: fileName,
            stage: stage
          },
          S3Key: `logs/${municipality}/${assetType}/${fileName}.json`
        })
      )
    );
  } catch (error) {
    console.error(`Error in matchRoadLink: ${(error as Error).message}`);

    const deleteKey = `geojson/${event.key.split('/')[1]}/${event.key.split('/')[2]}/${
      event.key.split('/')[3]
    }`;

    try {
      await deleteFromS3(bucketName, deleteKey);
      console.log(`Deleted ${deleteKey} due to matchRoadLink failure.`);
    } catch (deleteError) {
      console.error(`Failed to delete ${deleteKey}: ${(deleteError as Error).message}`);
    }

    throw error;
  }
};

export const main = middyfy(matchRoadLinks);
