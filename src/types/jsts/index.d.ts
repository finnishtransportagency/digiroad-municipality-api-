declare namespace jsts {
  namespace geom {
    export class PrecisionModel {
      static FIXED: string;
      static FLOATING: string;
      static FLOATING_SINGLE: string;

      constructor(modelType?: number | string);
    }

    export class GeometryFactory {
      constructor(precisionModel?: PrecisionModel, SRID?: number);

      createLineString(coordinates: Array<Coordinate>): LineString;
    }

    export class Coordinate {
      constructor(x: number, y: number);

      constructor(c: Coordinate);

      constructor();

      constructor(x: number, y: number, z: number);

      x: number;

      y: number;

      z: number;
    }

    export class Geometry {
      constructor(factory?: any);
    }

    export class LineString extends Geometry {
      constructor(points: Array<Coordinate>, factory?: any);
    }
  }
  namespace algorithm {
    namespace distance {
      import Coordinate = jsts.geom.Coordinate;
      import LineString = jsts.geom.LineString;

      export class PointPairDistance {
        constructor();

        getCoordinate(i: number): Coordinate;

        getDistance(): number;

        initialize(): void;

        initialize(p0: Coordinate, p1: Coordinate): void;
      }

      export class DistanceToPoint {
        constructor();

        static computeDistance(
          line: LineString,
          pt: Coordinate,
          ptDist: PointPairDistance
        ): void;
      }
    }
  }
}
declare module 'jsts' {
  export = jsts;
}
