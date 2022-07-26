import { middyfy } from '@libs/lambda';
import * as aws from 'aws-sdk';
import Coordinate from 'jsts/org/locationtech/jts/geom/Coordinate.js';
import PrecisionModel from 'jsts/org/locationtech/jts/geom/PrecisionModel.js';
import GeometryFactory from 'jsts/org/locationtech/jts/geom/GeometryFactory.js';
import PointPairDistance from 'jsts/org/locationtech/jts/algorithm/distance/PointPairDistance.js';
import DistanceToPoint from 'jsts/org/locationtech/jts/algorithm/distance/DistanceToPoint.js';

import { PayloadFeature, ObstacleFeature } from '@functions/typing';
const matchRoadLinks = async (event) => {
  console.log(`matchRoadLinks invoked. Event: ${JSON.stringify(event)}`);
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
  const roadLinks = JSON.parse(
    await getObject(
      `dr-kunta-${process.env.STAGE_NAME}-bucket`,
      'roadLinks/espoo-tuomarila'
    )
  );

  const obstacles: Array<ObstacleFeature> = event.Created;
  const geomFactory = new GeometryFactory(new PrecisionModel(), 3067);
  const pointPairDistance = new PointPairDistance();

  for (var p = 0; p < obstacles.length; p++) {
    pointPairDistance.initialize();
    const obstacle = obstacles[p];

    const obstacleCoords = new Coordinate(
      obstacle.geometry.coordinates[0],
      obstacle.geometry.coordinates[1]
    );
    var minDistance = Number.MAX_VALUE;
    var minLink = {};
    var minLinkCoordinates = [];
    var minPosOnLink;
    for (let i = 0; i < roadLinks.length; i++) {
      const roadlink = roadLinks[i];
      const points = roadlink.points;
      const coordinates = [];
      for (let j = 0; j < points.length; j++) {
        const point = points[j];
        coordinates[j] = new Coordinate(point.x, point.y, point.z);
      }
      var lineString = geomFactory.createLineString(coordinates);
      console.log('lineString: ', lineString);
      DistanceToPoint.computeDistance(
        lineString,
        obstacleCoords,
        pointPairDistance
      );
      var distance = pointPairDistance.getDistance();
      if (distance < minDistance) {
        console.log('<');
        minDistance = distance;
        minLink = roadlink;
        minLinkCoordinates = coordinates;
        minPosOnLink = pointPairDistance.getCoordinate(0);
      }
    }
    console.log('minPosLink: ', minDistance);
    pointPairDistance.initialize();
    for (let i = 0; i < minLinkCoordinates.length - 1; i++) {
      const startPoint = minLinkCoordinates[i];
      const endPoint = minLinkCoordinates[i + 1];
      const line = geomFactory.createLineString([startPoint, endPoint]);
      DistanceToPoint.computeDistance(line, obstacleCoords, pointPairDistance);
      if (pointPairDistance.getDistance() === minDistance) {
        const start = new Coordinate(
          minLink.points[i].x,
          minLink.points[i].y,
          minLink.points[i].z
        );
        pointPairDistance.initialize(minPosOnLink, start);
        //console.log(minLink.points[i].m);
        //console.log(pointPairDistance.getDistance());
        //console.log(pointPairDistance.getCoordinates());
        //console.log(minLink.points[i].m + pointPairDistance.getDistance());
      }
    }
  }
  const payLoad: PayloadFeature = {
    Created: event.Created,
    Deleted: event.Deleted,
    Updated: event.Updated
  };
  const lambda = new aws.Lambda();
  const param = {
    FunctionName: `digiroad-municipality-api-${process.env.STAGE_NAME}-reportRejectedDelta`,
    InvocationType: 'Event',
    Payload: JSON.stringify(payLoad)
  };
  await lambda.invoke(param).promise();
};

export const main = middyfy(matchRoadLinks);
