import {
  LinkObject,
  matchResultObject,
  DrKuntaFeature,
  TrafficSignProperties
} from '@functions/typing';
import { getDistance3D, getLinkBearing } from '@libs/spatial-tools';
import DistanceToPoint from 'jsts/org/locationtech/jts/algorithm/distance/DistanceToPoint';

export default function (
  feature: DrKuntaFeature,
  linkCoordinates: Array<jsts.org.locationtech.jts.geom.Coordinate>,
  link: LinkObject,
  distanceToFeature: number,
  closestPointOnLink: jsts.org.locationtech.jts.geom.Coordinate,
  featureCoordinates: jsts.org.locationtech.jts.geom.Coordinate,
  pointPairDistance: jsts.org.locationtech.jts.algorithm.distance.PointPairDistance,
  geomFactory: jsts.org.locationtech.jts.geom.GeometryFactory,
  MAX_OFFSET: number,
  roadAngle?: number,
  towardsDigitizing?: boolean
) {
  let mValue = 0;
  for (let i = 0; i < linkCoordinates.length - 1; i++) {
    const startPoint = linkCoordinates[i];
    const endPoint = linkCoordinates[i + 1];
    const linkBearing = getLinkBearing(
      [startPoint.x, startPoint.y],
      [endPoint.x, endPoint.y]
    );
    const lineOnLink = geomFactory.createLineString([startPoint, endPoint]);
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

    result.DR_M_VALUE = mValue + getDistance3D(closestPointOnLink, startPoint);
    result.DR_OFFSET = distanceToFeature;
    result.DR_REJECTED = distanceToFeature >= MAX_OFFSET;
    result.DR_GEOMETRY = closestPointOnLink;
    return result;
  }
}
