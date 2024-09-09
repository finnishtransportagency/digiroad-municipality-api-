import { number, object, string, tuple } from 'yup';

const pointGeometrySchema = object({
  type: string().oneOf(['Point']).required(),
  coordinates: tuple([
    number().required(),
    number().required(),
    number().notRequired()
  ]).required()
}).required();

export { pointGeometrySchema };
