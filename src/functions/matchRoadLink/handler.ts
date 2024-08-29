import { invokeLambda, middyfy } from '@libs/lambda-tools';
import matchTrafficSign from './trafficSigns/matchTrafficSign';
import matchObstacle from './obstacles/matchObstacle';
import matchSurface from './surface/matchSurface';
import GeometryFactory from 'jsts/org/locationtech/jts/geom/GeometryFactory';
import PrecisionModel from 'jsts/org/locationtech/jts/geom/PrecisionModel';

import { getFromS3, uploadToS3 } from '@libs/s3-tools';
import {
  PayloadFeature,
  DrKuntaFeature,
  LinkObject,
  FeatureType
} from '@functions/typing';
import { isFeatureRoadlinkMap } from './types';
import { bucketName, MAX_OFFSET } from '@functions/config';
import {
  GetNearbyLinksPayload,
  isS3KeyObject,
  isUpdatePayload,
  S3KeyObject
} from '@customTypes/eventTypes';
import { ValidFeature } from '@customTypes/featureTypes';
import { updatePayloadSchema } from '@schemas/updatePayloadSchema';

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

  let rejectsAmount = 0;
  const features: Array<ValidFeature> = updatePayload.Created.concat(
    updatePayload.Updated
  );
  if (updatePayload.metadata.assetType === 'roadSurfaces') {
    console.warn('Surface matching is not implemented yet');
    return;
    /* //combineSurfaces could maybe be implemented in the parsing phase in fetchAndParseData
    features = combineSurfaces(features) as unknown as Array<DrKuntaFeature>;
    delta.Created = features;
    delta.Updated = []; */
  }
  const geomFactory = new GeometryFactory(new PrecisionModel(), 3067);
  const getNearbyLinksPayload: GetNearbyLinksPayload = {
    features: features,
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
  if (!Array.isArray(allRoadLinks) || !allRoadLinks.every(isFeatureRoadlinkMap))
    throw new Error(
      `S3 object ${allRoadLinksS3Key} is not valid Array<FeatureRoadlinkMap>`
    );

  for (let p = 0; p < features.length; p++) {
    const feature = features[p];
    const roadLinks: Array<LinkObject> | undefined = allRoadLinks.find(
      (i) => i.id === feature.properties.ID && i.type === feature.properties.TYPE
    )?.roadlinks;
    if (roadLinks) {
      switch (feature.properties.TYPE) {
        case FeatureType.Obstacle: {
          const obstacleMatchResults = matchObstacle(
            roadLinks,
            feature,
            geomFactory,
            MAX_OFFSET
          );
          if (!obstacleMatchResults) {
            console.error('matchResult is undefined');
            return;
          }

          if (obstacleMatchResults.DR_REJECTED) {
            rejectsAmount++;
          }

          feature.properties = {
            ...feature.properties,
            ...obstacleMatchResults
          };
          break;
        }
        case FeatureType.TrafficSign: {
          const trafficSignMatchResults = matchTrafficSign(
            roadLinks,
            feature,
            geomFactory
          );
          if (!trafficSignMatchResults) {
            console.error('matchResult is undefined');
            return;
          }

          if (trafficSignMatchResults.DR_REJECTED) {
            rejectsAmount++;
          }

          feature.properties = {
            ...feature.properties,
            ...trafficSignMatchResults
          };
          break;
        }
        case FeatureType.Surface: {
          const surfaceMatchResults = matchSurface(roadLinks, feature, geomFactory);
          console.log('surfaceMatchResults:\n', surfaceMatchResults);
          /* if (!surfaceMatchResults) {
            console.error('matchResult is undefined');
            return;
          }

          if (surfaceMatchResults.DR_REJECTED) {
            rejectsAmount++;
          }

          delete feature['geometry'];
          feature.properties = {
            ...feature.properties,
            ...surfaceMatchResults
          }; */
          console.warn('Surface matching is not implemented yet');
          break;
        }
      }
    } else {
      rejectsAmount++;
      feature.properties.DR_REJECTED = true;
    }
  }
  const execDelta2SQLBody: PayloadFeature = {
    Created: updatePayload.Created.filter(
      (feature: DrKuntaFeature) => !feature.properties.DR_REJECTED
    ),
    Deleted: updatePayload.Deleted,
    Updated: updatePayload.Updated.filter(
      (feature: DrKuntaFeature) => !feature.properties.DR_REJECTED
    ),
    metadata: {
      OFFSET_LIMIT: MAX_OFFSET,
      municipality: updatePayload.metadata.municipality,
      assetType: updatePayload.metadata.assetType
    }
  };

  const logsBody = {
    Rejected: {
      Created: updatePayload.Created.filter(
        (feature: DrKuntaFeature) => feature.properties.DR_REJECTED
      ),
      Updated: updatePayload.Updated.filter(
        (feature: DrKuntaFeature) => feature.properties.DR_REJECTED
      )
    },
    Accepted: {
      Created: updatePayload.Created.filter(
        (feature: DrKuntaFeature) => !feature.properties.DR_REJECTED
      ),
      Deleted: updatePayload.Deleted,
      Updated: updatePayload.Updated.filter(
        (feature: DrKuntaFeature) => !feature.properties.DR_REJECTED
      )
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
