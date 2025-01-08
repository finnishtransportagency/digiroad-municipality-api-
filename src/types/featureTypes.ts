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

type Feature = ValidFeature | InvalidFeature;

type FeatureCollection = Omit<InferType<typeof geoJsonSchema>, 'features'> & {
  features: Array<Feature>;
};

type InvalidFeature = Omit<InferType<typeof invalidFeatureSchema>, 'properties'> & {
  properties: Omit<InferType<typeof invalidFeatureSchema>['properties'], 'feature'> & {
    feature: unknown;
  };
};

const isInvalidFeature = (value: unknown): value is InvalidFeature => {
  return invalidFeatureSchema.isValidSync(value);
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
  isInvalidFeature,
  Feature,
  FeatureCollection,
  AdditionalPanelParseObject,
  MatchedFeature
};
