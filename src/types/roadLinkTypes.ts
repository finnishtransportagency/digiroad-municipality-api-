import { featureNearbyLinksSchema } from '@schemas/featureNearbyLinksSchema';
import { InferType } from 'yup';

type FeatureNearbyLinks = InferType<typeof featureNearbyLinksSchema>;

export { FeatureNearbyLinks };
