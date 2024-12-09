import { InvalidFeature } from '@customTypes/featureTypes';
import {
  matchedObstacleSchema,
  matchedTrafficSignSchema,
  obstacleFeatureSchema,
  trafficSignFeatureSchema
} from '@schemas/geoJsonSchema';
import { trafficSignRules } from '@schemas/trafficSignTypes';
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
    kg: { t: 1000, kg: 1 },
    min: { h: 60, min: 1 },
    h: { min: 1 / 60, h: 1 }
  };

  const factor = conversionFactors[assumedUnit]?.[readUnit];
  const result = factor !== undefined ? value * factor : NaN;

  return !isNaN(result) ? parseFloat(result.toFixed(3)) : NaN;
};

export const convertUnit = (
  trafficSignCode: string,
  rawValue: number,
  unit: string | null,
  isHelsinki = false
) => {
  const assumedUnit = trafficSignRules[trafficSignCode].unit
    ? trafficSignRules[trafficSignCode].unit
    : undefined;
  if (isNaN(rawValue)) return rawValue;
  if (assumedUnit && unit) return transformValueToUnit(rawValue, assumedUnit, unit);

  // If Digiroad unit of traffic sign is kg, and raw value read
  // from municipality is under 100, assumes raw value is in tons.
  if (assumedUnit === 'kg' && rawValue < 100) {
    return rawValue * 1000;
  }
  // If Digiroad unit of traffic sign is min, and raw value read from municipality
  // is under 25 and not 5, 10 ,15, 20, assumes raw value is in hours.
  if (assumedUnit === 'min' && rawValue < 25 && ![5, 10, 15, 20].includes(rawValue)) {
    return rawValue * 60;
  }
  if (isHelsinki && assumedUnit === 'cm') return rawValue * 100;
  return rawValue;
};
