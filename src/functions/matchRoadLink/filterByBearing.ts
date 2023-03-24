import findMValue from './findMValue';
import Coordinate from 'jsts/org/locationtech/jts/geom/Coordinate';
import DistanceToPoint from 'jsts/org/locationtech/jts/algorithm/distance/DistanceToPoint';
import PointPairDistance from 'jsts/org/locationtech/jts/algorithm/distance/PointPairDistance';

import {
  Feature,
  LinkObject,
  LinkPoint,
  TrafficSignProperties
} from '@functions/typing';
import findNearestLink from './findNearestLink';
export default function (
  roadLinks: Array<LinkObject>,
  feature: Feature,
  geomFactory: jsts.org.locationtech.jts.geom.GeometryFactory,
  MAX_OFFSET: number
) {
  const trafficSignProperties = feature.properties as TrafficSignProperties;
  const featureCoordinates = new Coordinate(
    feature.geometry.coordinates[0],
    feature.geometry.coordinates[1]
  );
  const bearing = trafficSignProperties.SUUNTIMA;
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

  for (let i = 0; i < roadLinks.length; i++) {
    const roadlink = roadLinks[i];
    const roadlinkPoints = roadlink.points;
    for (let j = 0; j < roadlinkPoints.length - 1; j++) {
      const startPoint = roadlinkPoints[j];
      const endPoint = roadlinkPoints[j + 1];
      const angle = getAngle(startPoint, endPoint);
      const angleReverse = (angle + 180) % 360;
      if (
        (bearing > angle - MAX_ANGLE_OFFSET &&
          bearing < angle + MAX_ANGLE_OFFSET) ||
        (bearing > angleReverse - MAX_ANGLE_OFFSET &&
          bearing < angleReverse + MAX_ANGLE_OFFSET)
      ) {
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
  if (minDistance < 10) {
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
      minRoadAngle
    );
  } else {
    return findNearestLink(roadLinks, feature, geomFactory, MAX_OFFSET);
  }
}
