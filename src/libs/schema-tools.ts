import { InvalidFeature } from '@customTypes/featureTypes';
import {
  matchedObstacleSchema,
  matchedTrafficSignSchema,
  obstacleFeatureSchema,
  trafficSignFeatureSchema
} from '@schemas/geoJsonSchema';
import { array } from 'yup';

export const arrayOfValidFeature = (assetTypeField: string, report = false) => {
  return array().when(report ? `$${assetTypeField}` : assetTypeField, {
    is: 'obstacles',
    then: (schema) => schema.of(obstacleFeatureSchema),
    otherwise: (schema) => schema.of(trafficSignFeatureSchema)
  });
};

export const arrayOfMatchedFeature = (assetTypeField: string) => {
  return array().when(`$${assetTypeField}`, {
    is: 'obstacles',
    then: (schema) => schema.of(matchedObstacleSchema),
    otherwise: (schema) => schema.of(matchedTrafficSignSchema)
  });
};

export const invalidFeature = (feature: unknown, reason: string): InvalidFeature => {
  return {
    type: 'Invalid',
    id: '-1',
    properties: {
      reason,
      feature: feature as Record<string, unknown>
    }
  };
};
