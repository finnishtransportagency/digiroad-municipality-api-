import {
  additionalPanelFeatureSchema,
  geoJsonSchema,
  matchedObstacleSchema,
  matchedTrafficSignSchema,
  obstacleFeatureSchema,
  trafficSignFeatureSchema
} from '@schemas/geoJsonSchema';
import { pointGeometrySchema } from '@schemas/geometrySchema';
import { InferType } from 'yup';

type PointCoordinates = InferType<typeof pointGeometrySchema>['coordinates'];

type ObstacleType = InferType<typeof obstacleFeatureSchema>;
type TrafficSignType = InferType<typeof trafficSignFeatureSchema>;
type AdditionalPanelType = InferType<typeof additionalPanelFeatureSchema>;

type ValidFeature = ObstacleType | TrafficSignType;

type MatchedTrafficSignType = InferType<typeof matchedTrafficSignSchema>;
type MatchedObstacleType = InferType<typeof matchedObstacleSchema>;

type MatchedFeature = MatchedTrafficSignType | MatchedObstacleType;

interface InvalidFeature {
  type: 'Invalid';
  id: string;
  properties: {
    reason: string;
    feature: string;
  };
}

type Feature = ValidFeature | InvalidFeature;

type FeatureCollection = Omit<InferType<typeof geoJsonSchema>, 'features'> & {
  features: Array<ValidFeature>;
};

interface AdditionalPanelParseObject {
  additionalPanels: { [key: string]: Array<AdditionalPanelType['properties']> };
  rejected: Array<InvalidFeature>;
}

export {
  PointCoordinates,
  ObstacleType,
  TrafficSignType,
  AdditionalPanelType,
  ValidFeature,
  InvalidFeature,
  Feature,
  FeatureCollection,
  AdditionalPanelParseObject,
  MatchedFeature
};
