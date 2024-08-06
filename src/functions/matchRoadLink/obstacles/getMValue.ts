import { LinkObject, matchResultObject } from '@functions/typing';
import { createLineString, getDistance3D } from '@libs/spatial-tools';
import {
  PointPairDistance,
  DistanceToPoint
} from 'jsts/org/locationtech/jts/algorithm/distance_module';
import { Coordinate } from 'jsts/org/locationtech/jts/geom';

export default function (
  linkCoordinates: Array<Coordinate>,
  link: LinkObject,
  distanceToFeature: number,
  closestPointOnLink: Coordinate,
  featureCoordinates: Coordinate,
  pointPairDistance: PointPairDistance,
  MAX_OFFSET: number
) {
  let mValue = 0;
  for (let i = 0; i < linkCoordinates.length - 1; i++) {
    const startPoint = linkCoordinates[i];
    const endPoint = linkCoordinates[i + 1];
    const lineOnLink = createLineString([startPoint, endPoint]);
    pointPairDistance.initialize();
    DistanceToPoint.computeDistance(lineOnLink, featureCoordinates, pointPairDistance);

    if (pointPairDistance.getDistance() !== distanceToFeature) {
      mValue += lineOnLink.getLength();
      continue;
    }

    pointPairDistance.initialize(closestPointOnLink, startPoint);
    const distance2D = pointPairDistance.getDistance();
    const ratio = distance2D / lineOnLink.getLength();
    closestPointOnLink.z = startPoint.z + (endPoint.z - startPoint.z) * ratio;

    const result: matchResultObject = <matchResultObject>{};
    result.DR_LINK_ID = link.linkId;
    /**
     * The reason why M-value is calculated like this is to match the geometry-calculations
     * that are done in Digiroad to reduce unneccesary copies of assets in the database.
     */

    result.DR_M_VALUE =
      mValue +
      getDistance3D(
        [closestPointOnLink.x, closestPointOnLink.y, closestPointOnLink.z],
        [startPoint.x, startPoint.y, startPoint.z]
      );
    result.DR_OFFSET = distanceToFeature;
    result.DR_REJECTED = distanceToFeature >= MAX_OFFSET;
    result.DR_GEOMETRY = closestPointOnLink;
    return result;
  }
}
