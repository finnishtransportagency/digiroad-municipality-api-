import { Feature, TrafficSignType, ValidFeature } from '@customTypes/featureTypes';
import { FeatureNearbyLinks } from '@customTypes/roadLinkTypes';
import { MAX_OFFSET } from '@functions/config';
import { invalidFeature } from '@libs/schema-tools';
import { pointOnLine, getLinkBearing, similarBearing } from '@libs/spatial-tools';
import { GeoJsonFeatureType } from '@schemas/geoJsonSchema';
import LineString from 'ol/geom/LineString.js';
import { Coordinate } from 'ol/coordinate';

const isSimilarBearing = (
  feature: TrafficSignType,
  link: FeatureNearbyLinks['roadlinks'][0],
  closestPoint: Coordinate
) => {
  const segmentStartPoint = link.points.slice(0, -1).find((point, i) => {
    const nextPoint = link.points[i + 1];
    return pointOnLine(
      [
        [point.x, point.y],
        [nextPoint.x, nextPoint.y]
      ],
      [closestPoint[0], closestPoint[1]]
    );
  });
  const segmentBearing = segmentStartPoint
    ? getLinkBearing([segmentStartPoint.x, segmentStartPoint.y], closestPoint)
    : NaN;
  const bearing = feature.properties.SUUNTIMA;
  const towardsDigitizing = bearing > 270 || bearing <= 90;
  const accepted = similarBearing(bearing, segmentBearing, true);
  switch (link.directiontype) {
    case 0:
      return accepted;
    case 1:
      return accepted && towardsDigitizing;
    case 2:
      return accepted && !towardsDigitizing;
    default:
      return false;
  }
};

const getClosestLink = (
  feature: ValidFeature,
  nearbyLinks: FeatureNearbyLinks['roadlinks']
): Feature => {
  const featureCoords = feature.geometry.coordinates;
  const closestLink = nearbyLinks.reduce(
    (closest, link) => {
      const shape = new LineString(
        link['points'].reduce(
          (array, point) => [...array, point.x, point.y, point.z, point.m],
          [] as Array<number>
        ),
        'XYZM'
      );
      const closestPoint = shape.getClosestPoint([
        featureCoords[0],
        featureCoords[1],
        featureCoords[2] ?? 0
      ]);
      const distance = new LineString([
        closestPoint,
        [featureCoords[0], featureCoords[1], featureCoords[2] ?? 0]
      ]).getLength();
      const mValue = closestPoint[3];
      const closestX = closestPoint[0];
      const closestY = closestPoint[1];
      const closestZ = closestPoint[2];

      const similarLink = {
        link,
        distance,
        mValue,
        closestX,
        closestY,
        closestZ
      };

      if (
        ((f: ValidFeature): f is TrafficSignType =>
          f.properties.TYPE === GeoJsonFeatureType.TrafficSign)(feature)
      ) {
        return closest.distance > distance &&
          isSimilarBearing(feature, link, closestPoint)
          ? similarLink
          : closest;
      }

      return closest.distance > distance ? similarLink : closest;
    },
    {
      link: undefined,
      distance: Number.MAX_VALUE,
      mValue: NaN,
      closestX: 0,
      closestY: 0,
      closestZ: 0
    } as {
      link: FeatureNearbyLinks['roadlinks'][0] | undefined;
      distance: number;
      mValue: number;
      closestX: number;
      closestY: number;
      closestZ: number;
    }
  );
  if (closestLink.distance > MAX_OFFSET)
    return invalidFeature(feature, 'MAX_OFFSET too small');

  return {
    ...feature,
    properties: {
      ...feature.properties,
      DR_LINK_ID: closestLink.link?.linkId,
      DR_M_VALUE: closestLink.mValue,
      DR_OFFSET: closestLink.distance,
      DR_GEOMETRY: {
        x: closestLink.closestX,
        y: closestLink.closestY,
        z: closestLink.closestZ
      }
    }
  } as ValidFeature;
};

const matchFeature = (
  feature: ValidFeature,
  nearbyLinks: FeatureNearbyLinks['roadlinks']
): Feature => {
  if (nearbyLinks.length < 1) return invalidFeature(feature, 'No nearby links');
  switch (feature.properties.TYPE) {
    case GeoJsonFeatureType.Obstacle: {
      return getClosestLink(feature, nearbyLinks);
    }
    case GeoJsonFeatureType.TrafficSign:
      return getClosestLink(feature, nearbyLinks);
    default:
      break;
  }
  return invalidFeature(feature, `AssetType not supported by matchFeature.`);
};

export default matchFeature;
