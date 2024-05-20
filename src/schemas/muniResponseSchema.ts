import { array, date, number, object, string } from 'yup';

/**
 * Shallow check for the most important fields
 */
const infraoJsonSchema = object().shape({
  type: string()
    .required()
    .matches(/(^FeatureCollection$)/),
  numberReturned: number().required(),
  features: array().required() // Content in not checked
});

// v--------------- GEOMETRIES ---------------v //
const pointGeometrySchema = object().shape({
  type: string()
    .required()
    .matches(/(^Point$)/),
  coordinates: array().of(number().required()).min(2).max(3).required()
});

// TODO
const areaGeometrySchema = object().shape({});
// ^------------------------------------------^ //

const infraoObstacleSchema = object().shape({
  type: string()
    .required()
    .matches(/(^Feature$)/),
  id: string()
    .required()
    .matches(/(^\D+\.\d+$)/), // e.g. "Rakenne.123456789"
  geometry: pointGeometrySchema.required(),
  properties: object().shape({
    yksilointitieto: number().required(),
    alkuHetki: date().required(),
    loppuHetki: date().min(new Date()).notRequired(),
    malli: string()
      .required()
      .matches(/(^Pollari$|^Puomi$)/),
    rakenne: string()
      .required()
      .matches(/(^kulkuesteet \(pollarit, puomit\)$)/)
  })
});

export { infraoJsonSchema, infraoObstacleSchema };
