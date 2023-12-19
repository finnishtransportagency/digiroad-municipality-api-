import Coordinate from 'jsts/org/locationtech/jts/geom/Coordinate';
import DistanceToPoint from 'jsts/org/locationtech/jts/algorithm/distance/DistanceToPoint';
import PointPairDistance from 'jsts/org/locationtech/jts/algorithm/distance/PointPairDistance';

import {
  DrKuntaFeature,
  LinkObject,
  LinkPoint,
  TrafficSignProperties
} from '@functions/typing';

export default function (
  roadLinks: Array<LinkObject>,
  feature: DrKuntaFeature,
  geomFactory: jsts.org.locationtech.jts.geom.GeometryFactory
) {
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
  let minRoadAngle: number;
  let closestLink: LinkObject;
  let closestLinkCoordinates: Array<jsts.org.locationtech.jts.geom.Coordinate> =
    [];
  let closestPointOnLink: jsts.org.locationtech.jts.geom.Coordinate;

  function getAngle(start: LinkPoint, end: LinkPoint) {
    return 180 + Math.atan2(start.x - end.x, start.y - end.y) * (180 / Math.PI);
  }

  function angleDifference(p1: number, p2: number) {
    return 180 - Math.abs(Math.abs(p1 - p2) - 180);
  }

  for (let i = 0; i < roadLinks.length; i++) {
    const roadlink = roadLinks[i];
    const roadlinkPoints = roadlink.points;
    for (let j = 0; j < roadlinkPoints.length - 1; j++) {
      const startPoint = roadlinkPoints[j];
      const endPoint = roadlinkPoints[j + 1];
      const angle = getAngle(startPoint, endPoint);
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
        const startCoordinates = new Coordinate(
          startPoint.x,
          startPoint.y,
          startPoint.z
        );
        const endCoordinates = new Coordinate(
          endPoint.x,
          endPoint.y,
          endPoint.z
        );
        const lineString = geomFactory.createLineString([
          startCoordinates,
          endCoordinates
        ]);
        DistanceToPoint.computeDistance(
          lineString,
          featureCoordinates,
          pointPairDistance
        );
        const distance = pointPairDistance.getDistance();
        if (distance < minDistance && distance < 10) {
          const coordinates: Array<jsts.org.locationtech.jts.geom.Coordinate> =
            [];
          for (let k = 0; k < roadlinkPoints.length; k++) {
            const point = roadlinkPoints[k];
            coordinates[k] = new Coordinate(point.x, point.y, point.z);
          }
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
    trafficSignProperties.SUUNTIMA = Math.floor(minRoadAngle);
    return {
      feature: feature,
      closestLinkCoordinates: closestLinkCoordinates,
      closestLink: closestLink,
      minDistance: minDistance,
      closestPointOnLink: closestPointOnLink,
      featureCoordinates: featureCoordinates,
      pointPairDistance: pointPairDistance,
      geomFactory: geomFactory,
      towardsDigitizing: towardsDigitizing,
      minRoadAngle: minRoadAngle
    };
  } else {
    return undefined;
  }
}
