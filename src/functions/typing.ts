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
  type: string;
  properties: ObstacleProperties | TrafficSignProperties;
  geometry: {
    type: string;
    coordinates: Array<number>;
  };
}

export interface ObstacleProperties {
  ID: number;
  EST_TYYPPI: number;
  DR_LINK_ID?: number;
  DR_M_VALUE?: number;
  DR_OFFSET?: number;
  DR_REJECTED?: boolean;
  DR_GEOMETRY?: jsts.org.locationtech.jts.geom.Coordinate;
}

//Not actual
export interface TrafficSignProperties {
  ID: number;
  LM_TYYPPI: string;
  LM_TEKSTI: string;
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
  };
}

export interface FeatureRoadlinkMap {
  id: string;
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
