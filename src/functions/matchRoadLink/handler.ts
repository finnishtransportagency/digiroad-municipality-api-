import { middyfy } from '@libs/lambda';
import * as aws from 'aws-sdk';
import Coordinate from 'jsts/org/locationtech/jts/geom/Coordinate.js';
import PrecisionModel from 'jsts/org/locationtech/jts/geom/PrecisionModel.js';
import GeometryFactory from 'jsts/org/locationtech/jts/geom/GeometryFactory.js';
import PointPairDistance from 'jsts/org/locationtech/jts/algorithm/distance/PointPairDistance.js';
import findNearestLink from './findNearestLink';

import { PayloadFeature, ObstacleFeature, LinkObject } from '@functions/typing';

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

  const obstacles: Array<ObstacleFeature> = event.Created.concat(
    event.Deleted
  ).concat(event.Updated);
  const geomFactory: jsts.geom.GeometryFactory = new GeometryFactory(
    new PrecisionModel(),
    3067
  );
  const pointPairDistance: jsts.algorithm.distance.PointPairDistance =
    new PointPairDistance();

  for (let p = 0; p < obstacles.length; p++) {
    pointPairDistance.initialize();
    const obstacle = obstacles[p];

    const obstacleCoordinates: jsts.geom.Coordinate = new Coordinate(
      obstacle.geometry.coordinates[0],
      obstacle.geometry.coordinates[1]
    );
    findNearestLink(
      roadLinks,
      obstacle,
      obstacleCoordinates,
      pointPairDistance,
      geomFactory,
      MAX_OFFSET
    );
  }
  const payLoad: PayloadFeature = {
    Created: event.Created,
    Deleted: event.Deleted,
    Updated: event.Updated
  };
  console.log(JSON.stringify(payLoad));
  const lambda = new aws.Lambda();
  const param = {
    FunctionName: `digiroad-municipality-api-${process.env.STAGE_NAME}-reportRejectedDelta`,
    InvocationType: 'Event',
    Payload: JSON.stringify(payLoad)
  };
  await lambda.invoke(param).promise();
};

export const main = middyfy(matchRoadLinks);
