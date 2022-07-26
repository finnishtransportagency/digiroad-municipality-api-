declare namespace jsts {
  namespace algorithm {
    namespace distance {
      import Coordinate = jsts.geom.Coordinate;
      import Geometry = jsts.geom.Geometry;
      import LineSegment = jsts.geom.LineSegment;
      import LineString = jsts.geom.LineString;
      import Polygon = jsts.geom.Polygon;

      export class PointPairDistance {
        constructor();

        getCoordinate(i: number): Coordinate;

        getCoordinates(): Array<Coordinate>;

        getDistance(): number;

        initialize(): void;

        initialize(p0: Coordinate, p1: Coordinate): void;

        setMaximum(p0: Coordinate, p1: Coordinate): void;

        setMaximum(ptDist: PointPairDistance): void;

        setMinimum(p0: Coordinate, p1: Coordinate): void;

        setMinimum(ptDist: PointPairDistance): void;

        toString(): string;
      }

      export class DistanceToPoint {
        constructor();

        static computeDistance(
          geom: Geometry,
          pt: Coordinate,
          ptDist: PointPairDistance
        ): void;

        static computeDistance(
          segment: LineSegment,
          pt: Coordinate,
          ptDist: PointPairDistance
        ): void;

        static computeDistance(
          line: LineString,
          pt: Coordinate,
          ptDist: PointPairDistance
        ): void;

        static computeDistance(
          poly: Polygon,
          pt: Coordinate,
          ptDist: PointPairDistance
        ): void;
      }
    }
  }
}
