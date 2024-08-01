import { array, date, number, object, string } from 'yup';
import { pointGeometrySchema } from './geometrySchema';
import { trafficSignRules } from './trafficSignTypes';
import oldTrafficSignMapping from './oldTrafficSignMapping';

/**
 * Shallow check for the most important fields.
 * Contents of the features array are not checked!!!
 */
const infraoJsonSchema = object({
  type: string().oneOf(['FeatureCollection']).required(),
  numberReturned: number().required(),
  features: array().required() // Content in not checked
}).required();

const infraoObstacleSchema = object({
  type: string().oneOf(['Feature']).required(),
  id: string()
    .matches(/(^\D+\.\d+$)/)
    .required(), // e.g. "Rakenne.123456789"
  geometry: pointGeometrySchema.required(),
  properties: object({
    yksilointitieto: number().required(),
    alkuHetki: date().required(),
    loppuHetki: date().min(new Date()).notRequired(),
    malli: string().oneOf(['Pollari', 'Puomi']).required(),
    rakenne: string().oneOf(['kulkuesteet (pollarit, puomit)']).required()
  }).required()
}).required();

const infraoTrafficSignSchema = object({
  type: string().oneOf(['Feature']).required(),
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
    liikennemerkkityyppi: string()
      .default('INVALID_CODE')
      .when('liikennemerkkityyppi2020', {
        is: 'INVALID_CODE',
        then: (schema) =>
          schema
            .transform((code: string) => {
              const splitType = code.trim().split(' '); // e.g. ['A10'] or ['141.a', 'Töyssyjä']
              const code2020 = splitType[0];
              if (Object.keys(trafficSignRules).includes(code2020)) return code2020;
              const mapping = oldTrafficSignMapping[code2020.split('.')[0]]; // This split might not work for all cases
              if (!mapping) return 'INVALID_CODE';
              if (mapping.hasSubCode) return mapping.code[splitType[1]] ?? 'INVALID_CODE';
              return mapping.code.default ?? 'INVALID_CODE';
            })
            .required(),
        otherwise: (schema) => schema.notRequired()
      }),
    liikennemerkkityyppi2020: string()
      .transform((code: string) =>
        Object.keys(trafficSignRules).includes(code) ? code : 'INVALID_CODE'
      )
      .required()
  }).required()
}).required();

export { infraoJsonSchema, infraoObstacleSchema, infraoTrafficSignSchema };
