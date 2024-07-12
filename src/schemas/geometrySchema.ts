import { array, number, object, string } from 'yup';

const pointGeometrySchema = object({
  type: string().oneOf(['Point']).required(),
  coordinates: array().of(number().required()).default([0, 0]).min(2).max(3).required()
}).required();

// TODO
const areaGeometrySchema = object({}).required();

export { pointGeometrySchema, areaGeometrySchema };
