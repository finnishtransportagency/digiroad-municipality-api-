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

export interface SurfaceProperties {
  TYPE: string;
  P_TYYPPI: string;
  ID: string;
  DR_REJECTED?: boolean;
  DR_VALIDLINKS?: Array<{ linkid: string; length: number }>;
}

export interface DrKuntaFeature {
  type?: string;
  properties: ObstacleProperties | TrafficSignProperties | SurfaceProperties;
  geometry: {
    type: string;
    coordinates: Array<Array<Array<Array<number>>>> | Array<number>;
  };
}

export interface ObstacleProperties {
  TYPE: string;
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
  LK_TYYPPI: string;
  ARVO?: number;
  TEKSTI?: string;
  KOKO?: number;
  KALVON_TYYPPI?: number;
  VARI?: number;
}

export interface TrafficSignProperties {
  TYPE: string;
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
  DR_LINK_ID?: number;
  DR_M_VALUE?: number;
  DR_OFFSET?: number;
  OSOITE?: string;
  DR_REJECTED?: boolean;
  DR_GEOMETRY?: jsts.org.locationtech.jts.geom.Coordinate;
  TOWARDSDIGITIZING?: boolean;
}

export interface PayloadFeature {
  Created: Array<DrKuntaFeature>;
  Deleted: Array<DrKuntaFeature>;
  Updated: Array<DrKuntaFeature>;
  metadata?: {
    OFFSET_LIMIT?: number;
    municipality: string;
    assetType?: string;
  };
  invalidInfrao?: {
    sum: number;
    IDs: Array<string>;
  };
}

export interface FeatureRoadlinkMap {
  id: string;
  type: string;
  roadlinks: Array<LinkObject>;
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

export interface LinkObject {
  linkId: string;
  points: Array<LinkPoint>;
  directiontype?: number;
  roadname?: string;
  geometrylength?: number;
}

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
