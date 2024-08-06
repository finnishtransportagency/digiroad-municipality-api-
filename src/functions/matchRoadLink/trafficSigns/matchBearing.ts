import { Coordinate } from 'jsts/org/locationtech/jts/geom';
import {
  PointPairDistance,
  DistanceToPoint
} from 'jsts/org/locationtech/jts/algorithm/distance_module';

import { DrKuntaFeature, LinkObject, TrafficSignProperties } from '@functions/typing';
import { createLineString, getLinkBearing } from '@libs/spatial-tools';

export default function (roadLinks: Array<LinkObject>, feature: DrKuntaFeature) {
  const trafficSignProperties = feature.properties as TrafficSignProperties;
  const featureCoordinates = new Coordinate(
    feature.geometry.coordinates[0] as number,
    feature.geometry.coordinates[1] as number
  );
  const bearing = trafficSignProperties.SUUNTIMA;
  const towardsDigitizing = bearing > 270 || bearing <= 90;
  const adjustedBearing = towardsDigitizing
    ? bearing
    : bearing > 90 && bearing < 180
    ? bearing + 180
    : Math.abs(bearing - 180);
  const MAX_ANGLE_OFFSET = 25;
  const pointPairDistance = new PointPairDistance();
  let minDistance = Number.MAX_VALUE;
  let minRoadAngle: number | undefined;
  let closestLink: LinkObject | undefined;
  let closestLinkCoordinates: Array<Coordinate> = [];
  let closestPointOnLink: Coordinate | undefined;

  function angleDifference(p1: number, p2: number) {
    return 180 - Math.abs(Math.abs(p1 - p2) - 180);
  }

  for (let i = 0; i < roadLinks.length; i++) {
    const roadlink = roadLinks[i];
    const roadlinkPoints = roadlink.points;
    for (let j = 0; j < roadlinkPoints.length - 1; j++) {
      const startPoint = roadlinkPoints[j];
      const endPoint = roadlinkPoints[j + 1];
      const angle = getLinkBearing(
        [startPoint.x, startPoint.y, startPoint.z],
        [endPoint.x, endPoint.y, startPoint.z]
      );
      const angleReverse = (angle + 180) % 360;
      let accepted = false;
      if (roadlink.directiontype === 0) {
        accepted =
          angleDifference(adjustedBearing, angle) <= MAX_ANGLE_OFFSET ||
          Math.abs(adjustedBearing - angleReverse) <= MAX_ANGLE_OFFSET;
      } else {
        accepted =
          angleDifference(adjustedBearing, angle) <= MAX_ANGLE_OFFSET &&
          ((roadlink.directiontype === 1 && towardsDigitizing) ||
            (roadlink.directiontype === 2 && !towardsDigitizing));
      }
      if (accepted) {
        const startCoordinates = new Coordinate(startPoint.x, startPoint.y, startPoint.z);
        const endCoordinates = new Coordinate(endPoint.x, endPoint.y, endPoint.z);
        const lineString = createLineString([startCoordinates, endCoordinates]);
        DistanceToPoint.computeDistance(
          lineString,
          featureCoordinates,
          pointPairDistance
        );
        const distance = pointPairDistance.getDistance();
        if (distance < minDistance && distance < 10) {
          const coordinates: Array<Coordinate> = roadlinkPoints.map(
            (point) => new Coordinate(point.x, point.y, point.z)
          );

          minDistance = distance;
          closestLink = roadlink;
          closestLinkCoordinates = coordinates;
          closestPointOnLink = pointPairDistance.getCoordinate(0);
          minRoadAngle = angle;
        }
      }
    }
  }
  pointPairDistance.initialize();
  trafficSignProperties.SUUNTIMA = adjustedBearing;
  if (minDistance < 5) {
    trafficSignProperties.SUUNTIMA = Math.floor(minRoadAngle || 0);
    return {
      feature: feature,
      closestLinkCoordinates: closestLinkCoordinates,
      closestLink: closestLink,
      minDistance: minDistance,
      closestPointOnLink: closestPointOnLink,
      featureCoordinates: featureCoordinates,
      pointPairDistance: pointPairDistance,
      towardsDigitizing: towardsDigitizing,
      minRoadAngle: minRoadAngle
    };
  } else {
    return undefined;
  }
}
