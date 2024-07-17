import { invokeLambda, middyfy } from '@libs/lambda-tools';
import matchTrafficSign from './trafficSigns/matchTrafficSign';
import matchObstacle from './obstacles/matchObstacle';
import matchSurface from './surface/matchSurface';
import combineSurfaces from './surface/combineSurfaces';
import GeometryFactory from 'jsts/org/locationtech/jts/geom/GeometryFactory';
import PrecisionModel from 'jsts/org/locationtech/jts/geom/PrecisionModel';

import { getFromS3, uploadToS3 } from '@libs/s3-tools';
import {
  PayloadFeature,
  DrKuntaFeature,
  LinkObject,
  S3KeyObject,
  isS3KeyObject,
  FeatureType
} from '@functions/typing';
import { isDelta, isFeatureRoadlinkMap } from './types';
import { bucketName, MAX_OFFSET } from '@functions/config';

const now = new Date().toISOString().slice(0, 19);

const matchRoadLinks = async (event: S3KeyObject) => {
  console.log('matchRoadLinks event:', event);
  const delta = JSON.parse(await getFromS3(bucketName, event.key)) as unknown;
  if (!isDelta(delta))
    throw new Error(
      `S3 object ${event.key} is not valid Delta object:\n${JSON.stringify(delta)}`
    );

  let rejectsAmount = 0;
  let features: Array<DrKuntaFeature> = delta.Created.concat(delta.Updated);
  if (delta.metadata.assetType === 'roadSurfaces') {
    features = combineSurfaces(features) as unknown as Array<DrKuntaFeature>;
    delta.Created = features;
    delta.Updated = [];
  }
  const geomFactory = new GeometryFactory(new PrecisionModel(), 3067);
  const getNearbyLinksPayload = {
    features: features,
    municipality: delta.metadata.municipality,
    assetType: delta.metadata.assetType
  };

  await uploadToS3(
    bucketName,
    `getNearbyLinksRequestPayload/${delta.metadata.municipality}/${now}.json`,
    JSON.stringify(getNearbyLinksPayload)
  );

  const invocationResult = Buffer.from(
    (
      await invokeLambda(
        'getNearbyLinks',
        'RequestResponse',
        Buffer.from(
          JSON.stringify({
            key: `getNearbyLinksRequestPayload/${delta.metadata.municipality}/${now}.json`
          })
        )
      )
    ).Payload
  ).toString();

  const parsedResult = JSON.parse(invocationResult) as unknown;
  if (!isS3KeyObject(parsedResult)) {
    throw new Error(
      `getNearbyLinks lambda invocation result is not valid S3KeyObject:\n`,
      parsedResult
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

          if (!surfaceMatchResults) {
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
          };
          break;
        }
      }
    } else {
      rejectsAmount++;
      feature.properties.DR_REJECTED = true;
    }
  }
  const execDelta2SQLBody: PayloadFeature = {
    Created: delta.Created.filter(
      (feature: DrKuntaFeature) => !feature.properties.DR_REJECTED
    ),
    Deleted: delta.Deleted,
    Updated: delta.Updated.filter(
      (feature: DrKuntaFeature) => !feature.properties.DR_REJECTED
    ),
    metadata: {
      OFFSET_LIMIT: MAX_OFFSET,
      municipality: delta.metadata.municipality,
      assetType: delta.metadata.assetType
    }
  };

  const logsBody = {
    Rejected: {
      Created: delta.Created.filter(
        (feature: DrKuntaFeature) => feature.properties.DR_REJECTED
      ),
      Updated: delta.Updated.filter(
        (feature: DrKuntaFeature) => feature.properties.DR_REJECTED
      )
    },
    Accepted: {
      Created: delta.Created.filter(
        (feature: DrKuntaFeature) => !feature.properties.DR_REJECTED
      ),
      Deleted: delta.Deleted,
      Updated: delta.Updated.filter(
        (feature: DrKuntaFeature) => !feature.properties.DR_REJECTED
      )
    },
    invalidInfrao: delta.invalidInfrao,
    metadata: {
      OFFSET_LIMIT: MAX_OFFSET,
      municipality: delta.metadata.municipality,
      assetType: delta.metadata.assetType
    }
  };

  await uploadToS3(
    bucketName,
    `matchRoadLink/${delta.metadata.municipality}/${now}.json`,
    JSON.stringify(execDelta2SQLBody)
  );

  await uploadToS3(
    bucketName,
    `logs/${delta.metadata.municipality}/${now}.json`,
    JSON.stringify(logsBody)
  );

  await invokeLambda(
    'execDelta2SQL',
    'Event',
    Buffer.from(
      JSON.stringify({
        key: `matchRoadLink/${delta.metadata.municipality}/${now}.json`
      })
    )
  );

  const reportRejectedDeltabody = {
    assetType: delta.metadata.assetType,
    rejectsAmount: rejectsAmount,
    assetsAmount: delta.Created.length + delta.Updated.length,
    deletesAmount: delta.Deleted.length,
    invalidInfrao: delta.invalidInfrao,
    now: now
  };

  await invokeLambda(
    'reportRejectedDelta',
    'Event',
    Buffer.from(
      JSON.stringify({
        ReportType:
          rejectsAmount > 0 || delta.invalidInfrao.sum > 0
            ? 'matchedWithFailures'
            : 'matchedSuccessfully',
        Municipality: delta.metadata.municipality,
        Body: reportRejectedDeltabody
      })
    )
  );
};

export const main = middyfy(matchRoadLinks);
