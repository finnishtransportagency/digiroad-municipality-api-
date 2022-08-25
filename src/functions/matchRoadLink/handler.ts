import { middyfy } from '@libs/lambda';
import * as aws from 'aws-sdk';
import findNearestLink from './findNearestLink';
import GeometryFactory from 'jsts/org/locationtech/jts/geom/GeometryFactory';
import PrecisionModel from 'jsts/org/locationtech/jts/geom/PrecisionModel';
import PointPairDistance from 'jsts/org/locationtech/jts/algorithm/distance/PointPairDistance';

import {
  PayloadFeature,
  ObstacleFeature,
  LinkObject,
  ObstacleRoadLinkMap
} from '@functions/typing';

// Max offset permitted from middle of linestring
const MAX_OFFSET = 2;

const lambda = new aws.Lambda();

const matchRoadLinks = async (event) => {
  let rejectsAmount = 0;

  const obstacles: Array<ObstacleFeature> = event.Created.concat(
    event.Deleted
  ).concat(event.Updated);
  const geomFactory = new GeometryFactory(new PrecisionModel(), 3067);
  const pointPairDistance = new PointPairDistance();

  const getNearbyLinksPayload = {
    features: obstacles,
    municipality: event.metadata.municipality
  };
  const getNearbyLinksParams = {
    FunctionName: `digiroad-municipality-api-${process.env.STAGE_NAME}-getNearbyLinks`,
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify(getNearbyLinksPayload)
  };

  try {
    const invocationResult = await lambda
      .invoke(getNearbyLinksParams)
      .promise();
    var allRoadLinks = JSON.parse(
      invocationResult.Payload.toString()
    ) as Array<ObstacleRoadLinkMap>;
    for (let p = 0; p < obstacles.length; p++) {
      pointPairDistance.initialize();
      const obstacle = obstacles[p];
      const roadLinks: Array<LinkObject> | undefined = allRoadLinks.find(
        (i) => i.id === obstacle.properties.ID
      )?.roadlinks;

      if (roadLinks) {
        const matchResults = findNearestLink(
          roadLinks,
          obstacle,
          pointPairDistance,
          geomFactory,
          MAX_OFFSET
        );
        if (!matchResults) {
          console.log('matchResults is undefined');
          return;
        }

        if (matchResults.DR_REJECTED) {
          rejectsAmount++;
        }

        obstacle.properties = {
          ...obstacle.properties,
          ...matchResults
        };
      } else {
        rejectsAmount++;
        obstacle.properties.DR_REJECTED = true;
      }
    }
    const body: PayloadFeature = {
      Created: event.Created,
      Deleted: event.Deleted,
      Updated: event.Updated,
      metadata: {
        OFFSET_LIMIT: MAX_OFFSET,
        municipality: event.metadata.municipality
      }
    };

    const reportRejectedDeltaParams = {
      FunctionName: `digiroad-municipality-api-${process.env.STAGE_NAME}-reportRejectedDelta`,
      InvocationType: 'Event',
      Payload: JSON.stringify({
        ReportType:
          rejectsAmount > 0 ? 'matchedWithFailures' : 'matchedSuccessfully',
        Municipality: event.metadata.municipality,
        Body: body
      })
    };
    await lambda.invoke(reportRejectedDeltaParams).promise();
  } catch (error) {
    console.error('Matching failed:', error);
  }
};

export const main = middyfy(matchRoadLinks);
