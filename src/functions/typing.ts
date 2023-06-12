export interface GeoJSON {
  type: string;
  name?: string;
  crs?: {
    type?: string;
    properties?: {
      name?: string;
    };
  };
  features: Array<Feature>;
}

export interface Feature {
  type?: string;
  properties: ObstacleProperties | TrafficSignProperties;
  geometry: {
    type: string;
    coordinates: Array<number>;
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
  DR_REJECTED?: boolean;
  DR_GEOMETRY?: jsts.org.locationtech.jts.geom.Coordinate;
}

export interface PayloadFeature {
  Created: Array<Feature>;
  Deleted: Array<Feature>;
  Updated: Array<Feature>;
  metadata?: {
    OFFSET_LIMIT?: number;
    municipality: string;
    assetType?: string;
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
}

export interface matchResultObject {
  ID: string;
  EST_TYYPPI: number;
  DR_LINK_ID: string;
  DR_M_VALUE: number;
  DR_OFFSET: number;
  DR_REJECTED: boolean;
  DR_GEOMETRY: jsts.org.locationtech.jts.geom.Coordinate;
}
