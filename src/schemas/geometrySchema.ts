import { number, object, string, tuple } from 'yup';

const pointGeometrySchema = object({
  type: string().oneOf(['Point']).required(),
  coordinates: tuple([
    number().required(),
    number().required(),
    number().notRequired()
  ]).required()
}).required();

// TODO: Implement areaGeometrySchema
const areaGeometrySchema = object({}).required();

export { pointGeometrySchema, areaGeometrySchema };
