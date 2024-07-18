/**
 * Calculates the distance between two points
 * @param {Array<number>} coordinatesA - The coordinates of the first point
 * @param {Array<number>} coordinatesB - The coordinates of the second point
 */
export const getDistance = (
  coordinatesA: Array<number>,
  coordinatesB: Array<number>
): number => {
  if (coordinatesA.length < 2 || coordinatesB.length < 2)
    throw new Error('Invalid coordinates');
  const dx = coordinatesA[0] - coordinatesB[0];
  const dy = coordinatesA[1] - coordinatesB[1];
  return Math.sqrt(dx * dx + dy * dy);
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
