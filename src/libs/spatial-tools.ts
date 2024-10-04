import { PointCoordinates } from '@customTypes/featureTypes';
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
  const diff = Math.abs(bearingA - bearingB);
  return bothDirections
    ? diff <= 45 || (diff > 135 && diff <= 225) || diff > 315
    : diff <= 45 || diff >= 315;
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
  return booleanPointOnLine(point, lineString, { epsilon: 5e-8 });
};
