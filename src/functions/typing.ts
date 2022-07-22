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
