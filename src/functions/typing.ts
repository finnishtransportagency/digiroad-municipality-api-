export interface ObstacleGeoJSON {
  type: string;
  name?: string;
  crs?: {
    type?: string;
    properties?: {
      name?: string;
    };
  };
  features: Array<ObstacleFeature>;
}

export interface ObstacleFeature {
  type: string;
  properties: {
    ID: number;
    EST_TYYPPI: number;
    DR_LINK_ID?: number;
    DR_M_VALUE?: number;
    DR_OFFSET?: number;
    DR_REJECTED?: boolean;
  };
  geometry: {
    type: string;
    coordinates: Array<number>;
  };
}

export interface PayloadFeature {
  Created: Array<ObstacleFeature>;
  Deleted: Array<ObstacleFeature>;
  Updated: Array<ObstacleFeature>;
  metadata?: {
    OFFSET_LIMIT?: number;
    municipality: string;
  };
}

export interface ObstacleRoadLinkMap {
  id: number;
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
  linkId: number;
  points: Array<LinkPoint>;
}

export interface matchResultObject {
  ID: number;
  EST_TYYPPI: number;
  DR_LINK_ID: number;
  DR_M_VALUE: number;
  DR_OFFSET: number;
  DR_REJECTED: boolean;
}
