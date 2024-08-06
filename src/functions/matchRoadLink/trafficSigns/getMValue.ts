import {
  LinkObject,
  matchResultObject,
  DrKuntaFeature,
  TrafficSignProperties
} from '@functions/typing';
import { createLineString, getDistance3D, getLinkBearing } from '@libs/spatial-tools';
import {
  PointPairDistance,
  DistanceToPoint
} from 'jsts/org/locationtech/jts/algorithm/distance_module';
import { Coordinate } from 'jsts/org/locationtech/jts/geom';

export default function (
  feature: DrKuntaFeature,
  linkCoordinates: Array<Coordinate>,
  link: LinkObject,
  distanceToFeature: number,
  closestPointOnLink: Coordinate,
  featureCoordinates: Coordinate,
  pointPairDistance: PointPairDistance,
  MAX_OFFSET: number,
  roadAngle?: number,
  towardsDigitizing?: boolean
) {
  let mValue = 0;
  for (let i = 0; i < linkCoordinates.length - 1; i++) {
    const startPoint = linkCoordinates[i];
    const endPoint = linkCoordinates[i + 1];
    const linkBearing = getLinkBearing(
      [startPoint.x, startPoint.y, undefined],
      [endPoint.x, endPoint.y, undefined]
    );
    const lineOnLink = createLineString([startPoint, endPoint]);
    pointPairDistance.initialize();
    DistanceToPoint.computeDistance(lineOnLink, featureCoordinates, pointPairDistance);

    if (pointPairDistance.getDistance() !== distanceToFeature) {
      mValue += lineOnLink.getLength();
      continue;
    }

    if (roadAngle && roadAngle !== linkBearing) {
      mValue += lineOnLink.getLength();
      continue;
    }
    const roadLinkBearingAtPoint = linkBearing;
    pointPairDistance.initialize(closestPointOnLink, startPoint);
    const distance2D = pointPairDistance.getDistance();
    const ratio = distance2D / lineOnLink.getLength();
    closestPointOnLink.z = startPoint.z + (endPoint.z - startPoint.z) * ratio;

    const result: matchResultObject = <matchResultObject>{};
    result.DR_LINK_ID = link.linkId;
    /*
    The reason why M-value is calculated like this is to match the geometry-calculations that are done in Digiroad
    to reduce unneccesary copies of assets in the database.
    */

    const props = feature.properties as TrafficSignProperties;
    if (!towardsDigitizing) {
      const latDiff = (feature.geometry.coordinates[1] as number) - closestPointOnLink.y;
      const lonDiff = (feature.geometry.coordinates[0] as number) - closestPointOnLink.x;
      result.TOWARDSDIGITIZING =
        ((roadLinkBearingAtPoint <= 45 || roadLinkBearingAtPoint > 315) && lonDiff > 0) ||
        (roadLinkBearingAtPoint <= 135 && roadLinkBearingAtPoint > 45 && latDiff < 0) ||
        (roadLinkBearingAtPoint <= 225 && roadLinkBearingAtPoint > 135 && lonDiff < 0) ||
        (roadLinkBearingAtPoint <= 315 && roadLinkBearingAtPoint > 225 && latDiff > 0);
      props.SUUNTIMA = Math.floor(roadLinkBearingAtPoint);
    } else {
      result.TOWARDSDIGITIZING = towardsDigitizing;
    }

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
