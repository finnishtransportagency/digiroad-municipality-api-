import { AssetTypeString } from '@customTypes/eventTypes';
import { FeatureCollection, TrafficSignType } from '@customTypes/featureTypes';
import { FeatureCoordinates, PointCoordinates } from '@customTypes/geometryTypes';
import { FeatureNearbyLinks } from '@customTypes/roadLinkTypes';
import { allowedAgainstTraffic } from '@schemas/trafficSignTypes';
import booleanPointOnLine from '@turf/boolean-point-on-line';
import { Point, LineString } from 'geojson';
import { Coordinate } from 'ol/coordinate';
import proj4 from 'proj4';

proj4.defs(
  'EPSG:3879',
  '+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
);
proj4.defs(
  'EPSG:3067',
  '+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs'
);
export const helsinkiCoordTransform = (coords: [number, number]) =>
  proj4('EPSG:3879', 'EPSG:3067').forward(coords);

/**
 * Calculates the distance between two points
 * @param {PointCoordinates} pointA - The coordinates of the first point [x, y]
 * @param {PointCoordinates} pointB - The coordinates of the second point [x, y]
 */
export const getDistance2D = (
  pointA: PointCoordinates,
  pointB: PointCoordinates
): number => {
  const dx = pointA[0] - pointB[0];
  const dy = pointA[1] - pointB[1];
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculates the distance between two points in 3D space
 * @param {PointCoordinates} pointA - The coordinates of the first point [x, y, z]
 * @param {PointCoordinates} pointB - The coordinates of the second point [x, y, z]
 */
export const getDistance3D = (
  pointA: PointCoordinates,
  pointB: PointCoordinates
): number => {
  if (!pointA[2] || !pointB[2]) throw new Error('Z-coordinate is missing');
  return Math.sqrt(
    Math.pow(pointA[0] - pointB[0], 2) +
      Math.pow(pointA[1] - pointB[1], 2) +
      Math.pow(pointA[2] - pointB[2], 2)
  );
};

/**
 * Calculates the bearing of a roadlink
 * @param {PointCoordinates} start - The coordinates of the start point [x, y]
 * @param {PointCoordinates} end - The coordinates of the end point [x, y]
 * @returns The bearing of the roadlink in degrees
 */
export const getLinkBearing = (start: Coordinate, end: Coordinate): number => {
  return 180 + Math.atan2(start[0] - end[0], start[1] - end[1]) * (180 / Math.PI);
};

/**
 * Calculates whether the bearings are within 45 degrees of each other
 * @param {number} bearingA - The first bearing in degrees
 * @param {number} bearingB - The second bearing in degrees
 */
export const similarBearing = (
  bearingA: number,
  bearingB: number,
  bothDirections = false
): boolean => {
  if (bearingA < 0 || bearingA > 360 || bearingB < 0 || bearingB > 360)
    throw new Error('Invalid bearings');
  const initialDiff = Math.abs(bearingA - bearingB);
  const diff = initialDiff > 180 ? 360 - initialDiff : initialDiff;
  return bothDirections ? diff <= 45 || diff > 135 : diff <= 45;
};

/**
 * Compares bearings of traffic sign and road link taking into account the direction type of the link.
 * @param feature The traffic sign being compared
 * @param link The link being compared
 * @param closestPoint Closet point on link to the traffic sign being compared
 * @returns Accepted is true if bearings are within 45 degrees of each other. segmentBearing is bearing of link at closestPoint.
 */
export const similarSegmentBearing = (
  feature: TrafficSignType,
  link: FeatureNearbyLinks['roadlinks'][0],
  closestPoint: Coordinate
): { accepted: boolean; segmentBearing: number | undefined } => {
  const segmentPoints = link.points.slice(0, -1).reduce(
    (previousValue, currentPoint, i) => {
      const nextPoint = link.points[i + 1];
      const pointLine = pointOnLine(
        [
          [currentPoint.x, currentPoint.y],
          [nextPoint.x, nextPoint.y]
        ],
        [closestPoint[0], closestPoint[1]]
      );
      return pointLine
        ? {
            startPoint: currentPoint,
            endPoint: nextPoint
          }
        : previousValue;
    },
    {
      startPoint: undefined,
      endPoint: undefined
    } as {
      startPoint: FeatureCoordinates | undefined;
      endPoint: FeatureCoordinates | undefined;
    }
  );
  const segmentBearing =
    segmentPoints.startPoint && segmentPoints.endPoint
      ? getLinkBearing(
          [segmentPoints.startPoint.x, segmentPoints.startPoint.y],
          [segmentPoints.endPoint.x, segmentPoints.endPoint.y]
        )
      : NaN;
  const bearing = feature.properties.SUUNTIMA;
  if (allowedAgainstTraffic.includes(feature.properties.LM_TYYPPI))
    return { accepted: similarBearing(bearing, segmentBearing, true), segmentBearing };
  switch (link.directiontype) {
    case 0:
      return { accepted: similarBearing(bearing, segmentBearing, true), segmentBearing };
    case 1:
      return {
        accepted: similarBearing(bearing, segmentBearing),
        segmentBearing
      };
    case 2:
      return {
        accepted: similarBearing(bearing, oppositeBearing(segmentBearing)),
        segmentBearing
      };
    default:
      return { accepted: false, segmentBearing: undefined };
  }
};

/**
 * Turns bearing around 180 degrees and returns the opposite direction between 0 and 360.
 *
 * @param bearing Bearing in degrees
 * @returns Opposite direction in degrees
 */
export const oppositeBearing = (bearing: number) => {
  const bearingModulo = bearing < 0 ? 360 - (bearing % 360) : bearing % 360;
  return bearingModulo <= 180 ? bearingModulo + 180 : bearingModulo - 180;
};

export const pointOnLine = (
  lineCoordinates: [[number, number], [number, number]],
  pointCoordinates: [number, number]
): boolean => {
  const lineString: LineString = {
    type: 'LineString',
    coordinates: lineCoordinates
  };
  const point: Point = {
    type: 'Point',
    coordinates: pointCoordinates
  };
  return booleanPointOnLine(point, lineString, { epsilon: 5e-7 });
};

export const initializeFeatureCollection = (
  municipality: string,
  assetType: AssetTypeString,
  collectionType: string
): FeatureCollection => {
  return {
    type: 'FeatureCollection',
    name: `${municipality}-${String(assetType)}-${collectionType}`,
    crs: {
      type: 'name',
      properties: {
        name: 'urn:ogc:def:crs:EPSG::3067'
      }
    },
    features: []
  };
};
