import { arrayOfValidFeature } from '@libs/schema-tools';
import { array, number, object, string } from 'yup';

const updatePayloadSchema = object({
  Created: arrayOfValidFeature('metadata.assetType').required(),
  Updated: arrayOfValidFeature('metadata.assetType').required(),
  Deleted: arrayOfValidFeature('metadata.assetType').required(),
  metadata: object({
    municipality: string().required(),
    assetType: string().oneOf(['obstacles', 'trafficSigns', 'roadSurfaces']).required()
  }).required(),
  invalidInfrao: object({
    sum: number().required(),
    IDs: array().of(number()).required()
  }).required()
}).required();

export { updatePayloadSchema };
