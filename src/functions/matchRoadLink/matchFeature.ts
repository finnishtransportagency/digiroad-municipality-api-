import {
  InvalidFeature,
  MatchedFeature,
  TrafficSignType,
  ValidFeature
} from '@customTypes/featureTypes';
import { FeatureNearbyLinks } from '@customTypes/roadLinkTypes';
import { MAX_OFFSET } from '@functions/config';
import { invalidFeature } from '@libs/schema-tools';
import {
  oppositeBearing,
  similarBearing,
  similarSegmentBearing
} from '@libs/spatial-tools';
import { GeoJsonFeatureType } from '@schemas/geoJsonSchema';
import LineString from 'ol/geom/LineString.js';

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
        closestZ,
        segmentBearing: undefined as number | undefined
      };

      if (
        ((f: ValidFeature): f is TrafficSignType =>
          f.properties.TYPE === GeoJsonFeatureType.TrafficSign)(feature)
      ) {
        const { accepted, segmentBearing } = similarSegmentBearing(
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
      closestZ: 0,
      segmentBearing: undefined
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
  if (
    feature.properties.TYPE === GeoJsonFeatureType.TrafficSign &&
    closestLink.segmentBearing &&
    !similarBearing(closestLink.segmentBearing, feature.properties.SUUNTIMA, true)
  )
    return invalidFeature(
      feature,
      `Invalid directions: link (${
        closestLink.link ? closestLink.link.linkId : 'undefined'
      }) ${closestLink.segmentBearing}, feature direction ${feature.properties.SUUNTIMA}`
    );

  if (closestLink.distance > MAX_OFFSET)
    return invalidFeature(
      feature,
      `No same direction links within ${MAX_OFFSET}m distance: closest link (${
        closestLink.link ? closestLink.link.linkId : 'undefined'
      })`
    );

  if (feature.properties.TYPE === GeoJsonFeatureType.TrafficSign) {
    const latDiff = feature.geometry.coordinates[1] - closestLink.closestY;
    const lonDiff = feature.geometry.coordinates[0] - closestLink.closestX;

    const segmentBearing = closestLink.segmentBearing;

    const towardsDigitizing = segmentBearing
      ? ((segmentBearing <= 45 || segmentBearing > 315) && lonDiff > 0) ||
        (segmentBearing <= 135 && segmentBearing > 45 && latDiff < 0) ||
        (segmentBearing <= 225 && segmentBearing > 135 && lonDiff < 0) ||
        (segmentBearing <= 315 && segmentBearing > 225 && latDiff > 0)
      : undefined;

    const signBearing =
      towardsDigitizing || !segmentBearing
        ? segmentBearing
        : oppositeBearing(segmentBearing);

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
        SUUNTIMA: signBearing ? Math.round(signBearing) : undefined,
        TOWARDSDIGITIZING: towardsDigitizing
      }
    } as MatchedFeature;
  }
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
  } as MatchedFeature;
};

export default matchFeature;
