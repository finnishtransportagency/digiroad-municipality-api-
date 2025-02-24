import { featureNearbyLinksSchema } from '@schemas/featureNearbyLinksSchema';
import { pointGeometrySchema } from '@schemas/geometrySchema';
import { InferType } from 'yup';

type PointCoordinates = InferType<typeof pointGeometrySchema>['coordinates'];
type FeatureCoordinates = InferType<
  typeof featureNearbyLinksSchema
>['roadlinks'][0]['points'][0];

export { PointCoordinates, FeatureCoordinates };
