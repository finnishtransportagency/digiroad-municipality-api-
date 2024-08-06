import getMValue from './getMValue';
import { Coordinate } from 'jsts/org/locationtech/jts/geom';
import {
  PointPairDistance,
  DistanceToPoint
} from 'jsts/org/locationtech/jts/algorithm/distance_module';

import { DrKuntaFeature, LinkObject } from '@functions/typing';
import { createLineString } from '@libs/spatial-tools';
export default function (
  roadLinks: Array<LinkObject>,
  feature: DrKuntaFeature,
  MAX_OFFSET: number
) {
  const pointPairDistance = new PointPairDistance();
  let minDistance = Number.MAX_VALUE;
  let closestLink: LinkObject | undefined;
  let closestLinkCoordinates: Array<Coordinate> = [];
  let closestPointOnLink: Coordinate | undefined;

  const featureCoordinates = new Coordinate(
    feature.geometry.coordinates[0] as number,
    feature.geometry.coordinates[1] as number
  );

  for (let i = 0; i < roadLinks.length; i++) {
    const roadlink = roadLinks[i];
    const coordinates: Array<Coordinate> = roadlink.points.map(
      (point) => new Coordinate(point.x, point.y, point.z)
    );

    DistanceToPoint.computeDistance(
      createLineString(coordinates),
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
  if (!closestLink || !closestPointOnLink) return undefined;
  pointPairDistance.initialize();
  return getMValue(
    closestLinkCoordinates,
    closestLink,
    minDistance,
    closestPointOnLink,
    featureCoordinates,
    pointPairDistance,
    MAX_OFFSET
  );
}
