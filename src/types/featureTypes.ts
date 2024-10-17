import {
  additionalPanelFeatureSchema,
  geoJsonSchema,
  invalidFeatureSchema,
  matchedObstacleSchema,
  matchedTrafficSignSchema,
  obstacleFeatureSchema,
  trafficSignFeatureSchema
} from '@schemas/geoJsonSchema';
import { InferType } from 'yup';

type ObstacleType = InferType<typeof obstacleFeatureSchema>;
type TrafficSignType = InferType<typeof trafficSignFeatureSchema>;
type AdditionalPanelType = InferType<typeof additionalPanelFeatureSchema>;

type ValidFeature = ObstacleType | TrafficSignType | AdditionalPanelType;

type MatchedTrafficSignType = InferType<typeof matchedTrafficSignSchema>;
type MatchedObstacleType = InferType<typeof matchedObstacleSchema>;

type MatchedFeature = MatchedTrafficSignType | MatchedObstacleType;

type InvalidFeature = InferType<typeof invalidFeatureSchema>;

type Feature = ValidFeature | InvalidFeature;

type FeatureCollection = Omit<InferType<typeof geoJsonSchema>, 'features'> & {
  features: Array<ValidFeature>;
};

interface AdditionalPanelParseObject {
  additionalPanels: { [key: string]: Array<AdditionalPanelType['properties']> };
  rejected: Array<InvalidFeature>;
}

export {
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
