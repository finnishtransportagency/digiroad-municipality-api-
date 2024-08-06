declare module 'jsts/org/locationtech/jts/geom' {
  export class PrecisionModel {
    constructor();
  }

  export class Coordinate {
    constructor();
    constructor(x: number, y: number);
    constructor(x: number, y: number, z: number);

    x: number;

    y: number;

    z: number;
  }

  export class LineString {
    getLength(): number;
  }

  export class GeometryFactory {
    constructor(precisionModel: PrecisionModel, SRID: 3067);

    createLineString(coordinates: Array<Coordinate>): LineString;
  }
}

declare module 'jsts/org/locationtech/jts/algorithm/distance_module' {
  import { Coordinate, LineString } from 'jsts/org/locationtech/jts/geom';

  export class PointPairDistance {
    constructor();

    initialize(): void;
    initialize(p0: Coordinate, p1: Coordinate): void;

    getDistance(): number;

    getCoordinate(i: number): Coordinate;
  }

  export class DistanceToPoint {
    static computeDistance(
      line: LineString,
      point: Coordinate,
      distance: PointPairDistance
    ): void;
  }
}
