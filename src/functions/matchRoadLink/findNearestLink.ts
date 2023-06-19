import findMValue from './findMValue';
import Coordinate from 'jsts/org/locationtech/jts/geom/Coordinate';
import DistanceToPoint from 'jsts/org/locationtech/jts/algorithm/distance/DistanceToPoint';
import PointPairDistance from 'jsts/org/locationtech/jts/algorithm/distance/PointPairDistance';

import { Feature, LinkObject } from '@functions/typing';
export default function (
  roadLinks: Array<LinkObject>,
  feature: Feature,
  geomFactory: jsts.org.locationtech.jts.geom.GeometryFactory,
  MAX_OFFSET: number,
  towardsDigitizing?: boolean
) {
  const pointPairDistance = new PointPairDistance();
  let minDistance = Number.MAX_VALUE;
  let closestLink: LinkObject;
  let closestLinkCoordinates: Array<jsts.org.locationtech.jts.geom.Coordinate> =
    [];
  let closestPointOnLink: jsts.org.locationtech.jts.geom.Coordinate;

  const featureCoordinates = new Coordinate(
    feature.geometry.coordinates[0],
    feature.geometry.coordinates[1]
  );

  for (let i = 0; i < roadLinks.length; i++) {
    const roadlink = roadLinks[i];
    const points = roadlink.points;
    const coordinates: Array<jsts.org.locationtech.jts.geom.Coordinate> = [];
    for (let j = 0; j < points.length; j++) {
      const point = points[j];
      coordinates[j] = new Coordinate(point.x, point.y, point.z);
    }
    const lineString = geomFactory.createLineString(coordinates);
    DistanceToPoint.computeDistance(
      lineString,
      featureCoordinates,
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
    feature,
    closestLinkCoordinates,
    closestLink,
    minDistance,
    closestPointOnLink,
    featureCoordinates,
    pointPairDistance,
    geomFactory,
    MAX_OFFSET,
    undefined,
    towardsDigitizing
  );
}
