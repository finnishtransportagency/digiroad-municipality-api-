import {
  InvalidFeature,
  MatchedFeature,
  TrafficSignType,
  ValidFeature
} from '@customTypes/featureTypes';
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
      return { accepted, segmentBearing };
    case 1:
      return { accepted: accepted && towardsDigitizing, segmentBearing };
    case 2:
      return { accepted: accepted && !towardsDigitizing, segmentBearing };
    default:
      return { accepted: false, segmentBearing: undefined };
  }
};

const matchFeature = (
  feature: ValidFeature,
  nearbyLinks: FeatureNearbyLinks['roadlinks']
): MatchedFeature | InvalidFeature => {
  if (nearbyLinks.length < 1) return invalidFeature(feature, 'No nearby links');
  if (
    feature.properties.TYPE !== GeoJsonFeatureType.TrafficSign &&
    feature.properties.TYPE !== GeoJsonFeatureType.Obstacle
  )
    return invalidFeature(feature, `AssetType not supported by matchFeature.`);

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
        const { accepted, segmentBearing } = isSimilarBearing(
          feature,
          link,
          closestPoint
        );
        const newSimilarLink = { ...similarLink, segmentBearing };
        return closest.distance > distance && accepted ? newSimilarLink : closest;
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
      segmentBearing?: number;
    }
  );
  if (closestLink.distance > MAX_OFFSET)
    return invalidFeature(feature, 'MAX_OFFSET too small');

  const latDiff = feature.geometry.coordinates[1] - closestLink.closestY;
  const lonDiff = feature.geometry.coordinates[0] - closestLink.closestX;

  const towardsDigitizing = closestLink.segmentBearing
    ? ((closestLink.segmentBearing <= 45 || closestLink.segmentBearing > 315) &&
        lonDiff > 0) ||
      (closestLink.segmentBearing <= 135 &&
        closestLink.segmentBearing > 45 &&
        latDiff < 0) ||
      (closestLink.segmentBearing <= 225 &&
        closestLink.segmentBearing > 135 &&
        lonDiff < 0) ||
      (closestLink.segmentBearing <= 315 &&
        closestLink.segmentBearing > 225 &&
        latDiff > 0)
    : undefined;

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
      },
      TOWARDSDIGITIZING: towardsDigitizing
    }
  } as MatchedFeature;
};

export default matchFeature;
