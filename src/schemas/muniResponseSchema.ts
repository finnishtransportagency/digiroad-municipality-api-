import { array, date, mixed, number, object, string } from 'yup';
import { pointGeometrySchema } from './geometrySchema';

/**
 * Shallow check for the most important fields.
 * Contents of the features array are not checked!!!
 */
const infraoJsonSchema = object({
  type: mixed().oneOf(['FeatureCollection']).required(),
  numberReturned: number().required(),
  features: array().required() // Content in not checked
}).required();

const infraoObstacleSchema = object({
  type: mixed().oneOf(['Feature']).required(),
  id: string()
    .matches(/(^\D+\.\d+$)/)
    .required(), // e.g. "Rakenne.123456789"
  geometry: pointGeometrySchema.required(),
  properties: object()
    .shape({
      yksilointitieto: number().required(),
      alkuHetki: date().required(),
      loppuHetki: date().min(new Date()).notRequired(),
      malli: mixed().oneOf(['Pollari', 'Puomi']).required(),
      rakenne: mixed().oneOf(['kulkuesteet (pollarit, puomit)']).required()
    })
    .required()
}).required();

const infraoTrafficSignSchema = object({
  type: mixed().oneOf(['Feature']).required(),
  id: string()
    .matches(/(^\D+\.\d+$)/)
    .required(), // e.g. "Liikennemerkki.123456789"
  geometry: pointGeometrySchema.required(),
  properties: object({
    yksilointitieto: number().required(),
    alkuHetki: date().required(),
    loppuHetki: date().min(new Date()).notRequired(),
    suunta: number().notRequired().max(360).min(0),
    // TODO: required when liikennemerkkityyppi is speed limit sign
    teksti: string().notRequired(),
    // TODO: implement conditional formatting for new traffic sign codes
    liikennemerkkityyppi: string(),
    liikennemerkkityyppi2020: string().required()
  }).required()
}).required();

export { infraoJsonSchema, infraoObstacleSchema, infraoTrafficSignSchema };
