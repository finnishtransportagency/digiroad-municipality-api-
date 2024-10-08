import { InvalidFeature } from '@customTypes/featureTypes';
import { obstacleFeatureSchema, trafficSignFeatureSchema } from '@schemas/geoJsonSchema';
import { array } from 'yup';

export const arrayOfValidFeature = (assetTypeField: string) =>
  array().when(assetTypeField, {
    is: 'obstacles',
    then: (schema) => schema.of(obstacleFeatureSchema),
    otherwise: (schema) => schema.of(trafficSignFeatureSchema)
  });

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
