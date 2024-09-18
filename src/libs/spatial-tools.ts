import { PointCoordinates } from '@customTypes/featureTypes';
import { GeometryFactory } from 'jsts/org/locationtech/jts/geom';
import { PrecisionModel } from 'jsts/org/locationtech/jts/geom';
import { Coordinate } from 'ol/coordinate';

const geomFactory = new GeometryFactory(new PrecisionModel(), 3067);

/**
 * Creates jsts LineString from jsts Coordinates
 * @param {Array<Coordinate>} coordinates - The coordinates of the LineString
 */
export const createLineString = (coordinates: Array<Coordinate>) =>
  geomFactory.createLineString(coordinates);

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
export const similarBearing = (bearingA: number, bearingB: number): boolean => {
  if (bearingA < 0 || bearingA > 360 || bearingB < 0 || bearingB > 360)
    throw new Error('Invalid bearings');
  const diff = Math.abs(bearingA - bearingB);
  return diff <= 45 || diff >= 315;
};
