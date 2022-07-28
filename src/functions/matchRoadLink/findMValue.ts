import DistanceToPoint from 'jsts/org/locationtech/jts/algorithm/distance/DistanceToPoint.js';

import { ObstacleFeature, LinkObject } from '@functions/typing';

export default function (
  linkCoordinates: Array<jsts.geom.Coordinate>,
  link: LinkObject,
  distanceToObstacle: number,
  minPointOnLink: jsts.geom.Coordinate,
  obstacle: ObstacleFeature,
  obstacleCoordinates: jsts.geom.Coordinate,
  pointPairDistance: jsts.algorithm.distance.PointPairDistance,
  geomFactory: jsts.geom.GeometryFactory,
  MAX_OFFSET: number
) {
  for (let i = 0; i < linkCoordinates.length - 1; i++) {
    const startPoint = linkCoordinates[i];
    const endPoint = linkCoordinates[i + 1];
    const lineOnLink = geomFactory.createLineString([startPoint, endPoint]);
    DistanceToPoint.computeDistance(
      lineOnLink,
      obstacleCoordinates,
      pointPairDistance
    );
    if (pointPairDistance.getDistance() === distanceToObstacle) {
      pointPairDistance.initialize(minPointOnLink, startPoint);
      obstacle.properties.DR_LINK_ID = link.linkId;
      obstacle.properties.DR_M_VALUE =
        link.points[i].m + pointPairDistance.getDistance();
      obstacle.properties.DR_OFFSET = distanceToObstacle;
      obstacle.properties.DR_REJECTED = distanceToObstacle >= MAX_OFFSET;
    }
  }
}
