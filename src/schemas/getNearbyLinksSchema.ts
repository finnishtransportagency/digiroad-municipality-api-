import { object, string } from 'yup';
import { arrayOfValidFeature } from '@libs/schema-tools';
import { supportedMunicipalities } from '@functions/config';

const gnlPayloadSchema = object({
  features: arrayOfValidFeature('assetType').required(),
  municipality: string().required().oneOf(supportedMunicipalities),
  assetType: string().oneOf(['obstacles', 'trafficSigns']).required()
});

export { gnlPayloadSchema };
