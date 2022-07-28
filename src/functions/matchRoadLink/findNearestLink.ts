import DistanceToPoint from 'jsts/org/locationtech/jts/algorithm/distance/DistanceToPoint.js';
import Coordinate from 'jsts/org/locationtech/jts/geom/Coordinate.js';
import findMValue from './findMValue';

import { ObstacleFeature, LinkObject } from '@functions/typing';
export default function (
  roadLinks: Array<LinkObject>,
  obstacle: ObstacleFeature,
  pointPairDistance: jsts.algorithm.distance.PointPairDistance,
  geomFactory: jsts.geom.GeometryFactory,
  MAX_OFFSET: number
) {
  let minDistance = Number.MAX_VALUE;
  let closestLink: LinkObject;
  let closestLinkCoordinates: Array<jsts.geom.Coordinate> = [];
  let closestPointOnLink: jsts.geom.Coordinate;

  const obstacleCoordinates: jsts.geom.Coordinate = new Coordinate(
    obstacle.geometry.coordinates[0],
    obstacle.geometry.coordinates[1]
  );

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
      obstacleCoordinates,
      pointPairDistance
    );
    const distance = pointPairDistance.getDistance();
    if (distance < minDistance) {
      minDistance = distance;
      closestLink = roadlink;
      closestLinkCoordinates = coordinates;
      closestPointOnLink = pointPairDistance.getCoordinate(0);
    }
  }
  pointPairDistance.initialize();
  return findMValue(
    closestLinkCoordinates,
    closestLink,
    minDistance,
    closestPointOnLink,
    obstacleCoordinates,
    pointPairDistance,
    geomFactory,
    MAX_OFFSET
  );
}
