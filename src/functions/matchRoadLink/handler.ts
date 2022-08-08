import { middyfy } from '@libs/lambda';
import * as aws from 'aws-sdk';
import findNearestLink from './findNearestLink';
import GeometryFactory from 'jsts/org/locationtech/jts/geom/GeometryFactory';
import PrecisionModel from 'jsts/org/locationtech/jts/geom/PrecisionModel';
import PointPairDistance from 'jsts/org/locationtech/jts/algorithm/distance/PointPairDistance';

import { PayloadFeature, ObstacleFeature, LinkObject } from '@functions/typing';
import { rejects } from 'assert';

// Max offset permitted from middle of linestring
const MAX_OFFSET = 2;

const matchRoadLinks = async (event) => {
  const s3 = new aws.S3();
  async function getObject(bucket: string, objectKey: string) {
    try {
      const params = {
        Bucket: bucket,
        Key: objectKey
      };

      const data = await s3.getObject(params).promise();

      return data.Body.toString('utf-8');
    } catch (e) {
      throw new Error(`Could not retrieve file from S3: ${e.message}`);
    }
  }
  const roadLinks: Array<LinkObject> = JSON.parse(
    await getObject(
      `dr-kunta-${process.env.STAGE_NAME}-bucket`,
      'roadLinks/espoo-tuomarila'
    )
  );

  let rejectsAmount = 0;

  const obstacles: Array<ObstacleFeature> = event.Created.concat(
    event.Deleted
  ).concat(event.Updated);
  const geomFactory = new GeometryFactory(new PrecisionModel(), 3067);
  const pointPairDistance = new PointPairDistance();

  for (let p = 0; p < obstacles.length; p++) {
    pointPairDistance.initialize();
    const obstacle = obstacles[p];

    const matchResults = findNearestLink(
      roadLinks,
      obstacle,
      pointPairDistance,
      geomFactory,
      MAX_OFFSET
    );

    if (matchResults.DR_REJECTED) {
      rejectsAmount++;
    }

    obstacle.properties = {
      ...obstacle.properties,
      ...matchResults
    };
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

  const lambda = new aws.Lambda();
  const param = {
    FunctionName: `digiroad-municipality-api-${process.env.STAGE_NAME}-reportRejectedDelta`,
    InvocationType: 'Event',
    Payload: JSON.stringify({
      ReportType:
        rejectsAmount > 0 ? 'matchedWithFailures' : 'matchedSuccessfully',
      Municipality: event.metadata.municipality,
      Body: body
    })
  };
  await lambda.invoke(param).promise();
};

export const main = middyfy(matchRoadLinks);
