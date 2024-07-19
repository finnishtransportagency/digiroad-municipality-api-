import { PointCoordinates } from '@customTypes/featureTypes';

/**
 * Calculates the distance between two points
 * @param {PointCoordinates} pointA - The coordinates of the first point
 * @param {PointCoordinates} pointB - The coordinates of the second point
 */
export const getDistance2D = (
  pointA: PointCoordinates,
  pointB: PointCoordinates
): number => {
  const dx = pointA.x - pointB.x;
  const dy = pointA.y - pointB.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculates the distance between two points in 3D space
 * @param {PointCoordinates} pointA - The coordinates of the first point
 * @param {PointCoordinates} pointB - The coordinates of the second point
 */
export const getDistance3D = (
  pointA: PointCoordinates,
  pointB: PointCoordinates
): number => {
  if (!pointA.z || !pointB.z) throw new Error('Z-coordinate is missing');
  return Math.sqrt(
    Math.pow(pointA.x - pointB.x, 2) +
      Math.pow(pointA.y - pointB.y, 2) +
      Math.pow(pointA.z - pointB.z, 2)
  );
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
