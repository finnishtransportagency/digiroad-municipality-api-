export interface S3KeyObject {
  key: string;
}

export const isS3KeyObject = (s3KeyObject: unknown): s3KeyObject is S3KeyObject => {
  if (typeof s3KeyObject !== 'object' || s3KeyObject === null) {
    return false;
  }

  const { key } = s3KeyObject as S3KeyObject;

  if (typeof key !== 'string') {
    return false;
  }

  return true;
};

export interface GeoJSON {
  type: string;
  name?: string;
  crs?: {
    type?: string;
    properties?: {
      name?: string;
    };
  };
  features: Array<DrKuntaFeature>;
  invalidInfrao: {
    sum: number;
    IDs: Array<string>;
  };
}

export enum FeatureType {
  Obstacle = 'OBSTACLE',
  TrafficSign = 'TRAFFICSIGN',
  Surface = 'SURFACE'
}

enum GeometryType {
  Point = 'Point',
  MultiPolygon = 'MultiPolygon'
}

export interface DrKuntaFeature {
  type?: 'Feature';
  properties: ObstacleProperties | TrafficSignProperties | SurfaceProperties;
  geometry: {
    type: GeometryType;
    coordinates: Array<Array<Array<Array<number>>>> | Array<number>;
  };
}

export const isDrKuntaFeature = (
  kuntaFeature: unknown
): kuntaFeature is DrKuntaFeature => {
  if (typeof kuntaFeature !== 'object' || kuntaFeature === null) {
    return false;
  }

  const { type, properties, geometry } = kuntaFeature as DrKuntaFeature;

  if (
    (type && typeof type !== 'string') ||
    typeof properties !== 'object' ||
    properties === null ||
    typeof properties.TYPE !== 'string' ||
    !Object.values(FeatureType).includes(properties.TYPE) ||
    typeof geometry !== 'object' ||
    geometry === null ||
    typeof geometry.type !== 'string' ||
    !Object.values(GeometryType).includes(geometry.type)
  ) {
    return false;
  }

  return true;
};

export interface ObstacleProperties {
  TYPE: FeatureType.Obstacle;
  ID: string;
  EST_TYYPPI: number;
  DR_LINK_ID?: string;
  DR_M_VALUE?: number;
  DR_OFFSET?: number;
  DR_REJECTED?: boolean;
  DR_GEOMETRY?: jsts.org.locationtech.jts.geom.Coordinate;
  OSOITE?: string;
}

export interface additionalPanel {
  LM_TYYPPI: string;
  ARVO?: number;
  TEKSTI?: string;
  KOKO?: number;
  KALVON_TYYPPI?: number;
  VARI?: number;
}

export interface TrafficSignProperties {
  TYPE: FeatureType.TrafficSign;
  ID: string;
  SUUNTIMA: number;
  LM_TYYPPI: string;
  ARVO?: number;
  TEKSTI?: string;
  LISATIETO?: string;
  RAKENNE?: number;
  KUNTO?: number;
  KOKO?: number;
  LISAKILVET?: Array<additionalPanel>;
  DR_LINK_ID?: string;
  DR_M_VALUE?: number;
  DR_OFFSET?: number;
  OSOITE?: string;
  DR_REJECTED?: boolean;
  DR_GEOMETRY?: jsts.org.locationtech.jts.geom.Coordinate;
  TOWARDSDIGITIZING?: boolean;
}

export interface SurfaceProperties {
  TYPE: FeatureType.Surface;
  P_TYYPPI: string;
  ID: string;
  DR_REJECTED?: boolean;
  DR_VALIDLINKS?: Array<{ linkid: string; length: number }>;
}

export interface PayloadFeature {
  Created: Array<DrKuntaFeature>;
  Deleted: Array<DrKuntaFeature>;
  Updated: Array<DrKuntaFeature>;
  metadata?: {
    OFFSET_LIMIT?: number;
    municipality: string;
    assetType: string;
  };
  invalidInfrao?: {
    sum: number;
    IDs: Array<string>;
  };
}

export interface LinkPoint {
  srid?: number;
  hasZ?: boolean;
  hasM?: boolean;
  x: number;
  y: number;
  z: number;
  m: number;
}

export const isLinkPoint = (linkPoint: unknown): linkPoint is LinkPoint => {
  if (typeof linkPoint !== 'object' || linkPoint === null) {
    return false;
  }

  const { srid, hasZ, hasM, x, y, z, m } = linkPoint as LinkPoint;

  if (
    (srid && typeof srid !== 'number') ||
    (hasZ && typeof hasZ !== 'boolean') ||
    (hasM && typeof hasM !== 'boolean') ||
    typeof x !== 'number' ||
    typeof y !== 'number' ||
    typeof z !== 'number' ||
    typeof m !== 'number'
  ) {
    return false;
  }

  return true;
};

export interface LinkObject {
  linkId: string;
  points: Array<LinkPoint>;
  directiontype?: number;
  roadname?: string;
  geometrylength?: number;
}

export const isLinkObject = (linkObject: unknown): linkObject is LinkObject => {
  if (typeof linkObject !== 'object' || linkObject === null) {
    return false;
  }

  const { linkId, points, directiontype, roadname, geometrylength } =
    linkObject as LinkObject;

  if (
    typeof linkId !== 'string' ||
    !Array.isArray(points) ||
    !points.every((point) => isLinkPoint(point)) ||
    (directiontype && typeof directiontype !== 'number') ||
    (roadname && typeof roadname !== 'string') ||
    (geometrylength && typeof geometrylength !== 'number')
  ) {
    return false;
  }

  return true;
};

export interface matchResultObject {
  ID: string;
  EST_TYYPPI: number;
  DR_LINK_ID: string;
  DR_M_VALUE: number;
  DR_OFFSET: number;
  DR_REJECTED: boolean;
  DR_GEOMETRY: jsts.org.locationtech.jts.geom.Coordinate;
  TOWARDSDIGITIZING?: boolean;
}
