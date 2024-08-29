import {
  obstacleFeatureSchema,
  roadSurfaceFeatureSchema,
  trafficSignFeatureSchema
} from '@schemas/geoJsonSchema';
import { array } from 'yup';

export const arrayOfValidFeature = (assetTypeField: string) =>
  array()
    .when(assetTypeField, {
      is: 'obstacles',
      then: (schema) => schema.of(obstacleFeatureSchema),
      otherwise: (schema) => schema
    })
    .when(assetTypeField, {
      is: 'trafficSigns',
      then: (schema) => schema.of(trafficSignFeatureSchema),
      otherwise: (schema) => schema.of(roadSurfaceFeatureSchema)
    });
