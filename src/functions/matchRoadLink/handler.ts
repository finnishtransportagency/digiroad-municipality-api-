import { middyfy } from '@libs/lambda';
import * as aws from 'aws-sdk';
import Coordinate from 'jsts/org/locationtech/jts/geom/Coordinate.js';
import PrecisionModel from 'jsts/org/locationtech/jts/geom/PrecisionModel.js';
import GeometryFactory from 'jsts/org/locationtech/jts/geom/GeometryFactory.js';
import PointPairDistance from 'jsts/org/locationtech/jts/algorithm/distance/PointPairDistance.js';
import DistanceToPoint from 'jsts/org/locationtech/jts/algorithm/distance/DistanceToPoint.js';

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

    const obstacleCoords: jsts.geom.Coordinate = new Coordinate(
      obstacle.geometry.coordinates[0],
      obstacle.geometry.coordinates[1]
    );
    let minDistance = Number.MAX_VALUE;
    let minLink: LinkObject;
    let minLinkCoordinates: Array<jsts.geom.Coordinate> = [];
    let minPosOnLink: jsts.geom.Coordinate;
    for (let i = 0; i < roadLinks.length; i++) {
      const roadlink = roadLinks[i];
      const points = roadlink.points;
      const coordinates: Array<jsts.geom.Coordinate> = [];
      for (let j = 0; j < points.length; j++) {
        const point = points[j];
        coordinates[j] = new Coordinate(point.x, point.y, point.z);
      }
      const lineString = geomFactory.createLineString(coordinates);
      DistanceToPoint.computeDistance(
        lineString,
        obstacleCoords,
        pointPairDistance
      );
      const distance = pointPairDistance.getDistance();
      if (distance < minDistance) {
        minDistance = distance;
        minLink = roadlink;
        minLinkCoordinates = coordinates;
        minPosOnLink = pointPairDistance.getCoordinate(0);
      }
    }
    pointPairDistance.initialize();
    for (let i = 0; i < minLinkCoordinates.length - 1; i++) {
      const startPoint = minLinkCoordinates[i];
      const endPoint = minLinkCoordinates[i + 1];
      const line = geomFactory.createLineString([startPoint, endPoint]);
      DistanceToPoint.computeDistance(line, obstacleCoords, pointPairDistance);
      if (pointPairDistance.getDistance() === minDistance) {
        const start: jsts.geom.Coordinate = new Coordinate(
          minLink.points[i].x,
          minLink.points[i].y,
          minLink.points[i].z
        );
        pointPairDistance.initialize(minPosOnLink, start);

        obstacle.properties.DR_LINK_ID = minLink.linkId;
        obstacle.properties.DR_M_VALUE =
          minLink.points[i].m + pointPairDistance.getDistance();
        obstacle.properties.DR_OFFSET = minDistance;
        obstacle.properties.DR_REJECTED = minDistance >= MAX_OFFSET;
      }
    }
  }
  const payLoad: PayloadFeature = {
    Created: event.Created,
    Deleted: event.Deleted,
    Updated: event.Updated
  };
  payLoad.metadata = { OFFSET_LIMIT: MAX_OFFSET };
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
