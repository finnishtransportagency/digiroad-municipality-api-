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

export const transformValueToUnit = (
  value: number,
  assumedUnit: string,
  readUnit: string
): number => {
  const conversionFactors: Record<string, Record<string, number>> = {
    cm: { cm: 1, m: 100, km: 100000 },
    m: { cm: 0.01, m: 1, km: 1000 },
    km: { cm: 0.00001, m: 0.001, km: 1 },
    kg: { t: 1000 },
    min: { h: 60 },
    h: { min: Math.round((1 / 60) * 1000) / 1000 }
  };

  const factor = conversionFactors[assumedUnit]?.[readUnit];
  const result = factor !== undefined ? value * factor : NaN;

  return !isNaN(result) ? Math.round(result * 1000) / 1000 : NaN;
};
