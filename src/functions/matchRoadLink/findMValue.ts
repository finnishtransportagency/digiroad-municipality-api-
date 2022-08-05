import { LinkObject, matchResultObject } from '@functions/typing';

export default function (
  linkCoordinates: Array<jsts.geom.Coordinate>,
  link: LinkObject,
  distanceToObstacle: number,
  closestPointOnLink: jsts.geom.Coordinate,
  obstacleCoordinates: jsts.geom.Coordinate,
  pointPairDistance: jsts.algorithm.distance.PointPairDistance,
  geomFactory: jsts.geom.GeometryFactory,
  MAX_OFFSET: number
) {
  for (let i = 0; i < linkCoordinates.length - 1; i++) {
    const startPoint = linkCoordinates[i];
    const endPoint = linkCoordinates[i + 1];
    const lineOnLink = geomFactory.createLineString([startPoint, endPoint]);
    jsts.algorithm.distance.DistanceToPoint.computeDistance(
      lineOnLink,
      obstacleCoordinates,
      pointPairDistance
    );
    if (pointPairDistance.getDistance() === distanceToObstacle) {
      pointPairDistance.initialize(closestPointOnLink, startPoint);
      const result: matchResultObject = <matchResultObject>{};
      result.DR_LINK_ID = link.linkId;
      result.DR_M_VALUE = link.points[i].m + pointPairDistance.getDistance();
      result.DR_OFFSET = distanceToObstacle;
      result.DR_REJECTED = distanceToObstacle >= MAX_OFFSET;
      return result;
    }
  }
}
