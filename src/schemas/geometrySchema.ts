import { array, mixed, number, object } from 'yup';

const pointGeometrySchema = object({
  type: mixed().oneOf(['Point']).required(),
  coordinates: array()
    .of(number().required())
    .default([0, 0])
    .min(2)
    .max(3)
    .required()
}).required();

// TODO
const areaGeometrySchema = object().shape({}).required();

export { pointGeometrySchema, areaGeometrySchema };
