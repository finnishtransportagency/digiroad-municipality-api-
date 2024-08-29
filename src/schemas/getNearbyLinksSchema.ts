import { object, string } from 'yup';
import { arrayOfValidFeature } from '@libs/schema-tools';

const gnlPayloadSchema = object({
  features: arrayOfValidFeature('assetType').required(),
  municipality: string().required(),
  assetType: string().oneOf(['obstacles', 'trafficSigns', 'roadSurfaces']).required()
});

export { gnlPayloadSchema };
