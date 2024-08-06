import getMValue from './getMValue';
import matchBearing from './matchBearing';
import { Coordinate } from 'jsts/org/locationtech/jts/geom';
import {
  DistanceToPoint,
  PointPairDistance
} from 'jsts/org/locationtech/jts/algorithm/distance_module';

import { DrKuntaFeature, LinkObject, TrafficSignProperties } from '@functions/typing';
import { createLineString } from '@libs/spatial-tools';
export default function (roadLinks: Array<LinkObject>, feature: DrKuntaFeature) {
  const trafficSignProperties = feature.properties as TrafficSignProperties;
  let MAX_OFFSET = 5;
  if (trafficSignProperties.SUUNTIMA) {
    const result = matchBearing(roadLinks, feature);
    if (result && result.closestLink && result.closestPointOnLink) {
      return getMValue(
        result.feature,
        result.closestLinkCoordinates,
        result.closestLink,
        result.minDistance,
        result.closestPointOnLink,
        result.featureCoordinates,
        result.pointPairDistance,
        MAX_OFFSET,
        result.minRoadAngle,
        result.towardsDigitizing
      );
    }
    MAX_OFFSET = 2;
  }
  if (trafficSignProperties.OSOITE) {
    const filteredRoadlinks = roadLinks.filter((roadLink) => {
      return roadLink.roadname === trafficSignProperties.OSOITE;
    });
    if (filteredRoadlinks.length > 0) {
      roadLinks = filteredRoadlinks;
    }
  }
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
    const lineString = createLineString(coordinates);
    DistanceToPoint.computeDistance(lineString, featureCoordinates, pointPairDistance);
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
    feature,
    closestLinkCoordinates,
    closestLink,
    minDistance,
    closestPointOnLink,
    featureCoordinates,
    pointPairDistance,
    MAX_OFFSET
  );
}
