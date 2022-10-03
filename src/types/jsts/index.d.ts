declare namespace jsts {
  namespace org {
    namespace locationtech {
      namespace jts {
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

            getLength(): number;
          }
        }
        namespace algorithm {
          namespace distance {
            import Coordinate = jsts.org.locationtech.jts.geom.Coordinate;
            import LineString = jsts.org.locationtech.jts.geom.LineString;

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
    }
  }
}
declare module 'jsts/org/locationtech/jts/algorithm/distance/PointPairDistance' {
  export default jsts.org.locationtech.jts.algorithm.distance.PointPairDistance;
}

declare module 'jsts/org/locationtech/jts/algorithm/distance/DistanceToPoint' {
  export default jsts.org.locationtech.jts.algorithm.distance.DistanceToPoint;
}

declare module 'jsts/org/locationtech/jts/geom/GeometryFactory' {
  export default jsts.org.locationtech.jts.geom.GeometryFactory;
}

declare module 'jsts/org/locationtech/jts/geom/Coordinate' {
  export default jsts.org.locationtech.jts.geom.Coordinate;
}
declare module 'jsts/org/locationtech/jts/geom/LineString' {
  export default jsts.org.locationtech.jts.geom.LineString;
}
declare module 'jsts/org/locationtech/jts/geom/Geometry' {
  export default jsts.org.locationtech.jts.geom.Geometry;
}

declare module 'jsts/org/locationtech/jts/geom/PrecisionModel' {
  export default jsts.org.locationtech.jts.geom.PrecisionModel;
}
