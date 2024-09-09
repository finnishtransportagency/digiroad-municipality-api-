import {
  additionalPanelFeatureSchema,
  geoJsonSchema,
  obstacleFeatureSchema,
  trafficSignFeatureSchema
} from '@schemas/geoJsonSchema';
import { pointGeometrySchema } from '@schemas/geometrySchema';
import { InferType } from 'yup';

type PointCoordinates = InferType<typeof pointGeometrySchema>['coordinates'];

type ObstacleType = InferType<typeof obstacleFeatureSchema>;
type TrafficSignType = InferType<typeof trafficSignFeatureSchema>;
type AdditionalPanelType = InferType<typeof additionalPanelFeatureSchema>;
// TODO enable after implementing surfacePropertiesSchema & areaGeometrySchema
//type RoadSurfaceType = InferType<typeof roadSurfaceFeatureSchema>;

type ValidFeature = ObstacleType | TrafficSignType | AdditionalPanelType;
// TODO enable after implementing surfacePropertiesSchema & areaGeometrySchema
//| RoadSurfaceType;

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

export {
  PointCoordinates,
  ObstacleType,
  TrafficSignType,
  AdditionalPanelType,
  ValidFeature,
  InvalidFeature,
  Feature,
  FeatureCollection
};
