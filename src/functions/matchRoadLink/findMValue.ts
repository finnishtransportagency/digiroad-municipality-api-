import { LinkObject, matchResultObject } from '@functions/typing';
import DistanceToPoint from 'jsts/org/locationtech/jts/algorithm/distance/DistanceToPoint';

export default function (
  linkCoordinates: Array<jsts.org.locationtech.jts.geom.Coordinate>,
  link: LinkObject,
  distanceToObstacle: number,
  closestPointOnLink: jsts.org.locationtech.jts.geom.Coordinate,
  obstacleCoordinates: jsts.org.locationtech.jts.geom.Coordinate,
  pointPairDistance: jsts.org.locationtech.jts.algorithm.distance.PointPairDistance,
  geomFactory: jsts.org.locationtech.jts.geom.GeometryFactory,
  MAX_OFFSET: number
) {
  let mValue = 0;
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
      pointPairDistance.initialize(closestPointOnLink, startPoint);
      const distance2D = pointPairDistance.getDistance();
      const ratio = distance2D / lineOnLink.getLength();
      closestPointOnLink.z = startPoint.z + (endPoint.z - startPoint.z) * ratio;

      const distance3D = Math.sqrt(
        Math.pow(closestPointOnLink.x - startPoint.x, 2) +
          Math.pow(closestPointOnLink.y - startPoint.y, 2) +
          Math.pow(closestPointOnLink.z - startPoint.z, 2)
      );
      const result: matchResultObject = <matchResultObject>{};
      result.DR_LINK_ID = link.linkId;
      result.DR_M_VALUE = mValue + distance3D;
      result.DR_OFFSET = distanceToObstacle;
      result.DR_REJECTED = distanceToObstacle >= MAX_OFFSET;
      result.DR_GEOMETRY = closestPointOnLink;
      return result;
    } else {
      mValue += lineOnLink.getLength();
    }
  }
}
