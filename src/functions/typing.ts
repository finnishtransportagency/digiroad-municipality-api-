export interface ObstacleFeature {
  type: string;
  properties: {
    ID: number;
    EST_TYYPPI: number;
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
}

export interface LinkPoint {
  x: number;
  y: number;
  z: number;
  m: number;
}
//this is a temporary interface for our testdata for links
export interface LinkObject {
  linkId: number;
  points: Array<LinkPoint>;
}
