import { number, object, string } from 'yup';

const pointGeometrySchema = object({
  type: string().oneOf(['Point']).required(),
  coordinates: object({
    x: number().required(),
    y: number().required(),
    z: number().notRequired()
  }).transform((value: unknown) =>
    Array.isArray(value) && typeof value[0] === 'number' && typeof value[1] === 'number'
      ? value[2] && typeof value[2] === 'number'
        ? { x: value[0], y: value[1], z: value[2] }
        : { x: value[0], y: value[1] }
      : value
  )
}).required();

// TODO
const areaGeometrySchema = object({}).required();

export { pointGeometrySchema, areaGeometrySchema };
