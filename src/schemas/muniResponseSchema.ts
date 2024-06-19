import { array, date, mixed, number, object, string } from 'yup';
import {
  trafficSignRules,
  trafficSignsWithTextValue
} from './trafficSignTypes';
import { oldTrafficSignMapping } from './trafficSignMapping';

/**
 * Shallow check for the most important fields
 */
const infraoJsonSchema = object().shape({
  type: mixed().oneOf(['FeatureCollection']).required(),
  numberReturned: number().required(),
  features: array().required() // Content in not checked
});

// v--------------- GEOMETRIES ---------------v //
const pointGeometrySchema = object().shape({
  type: mixed().oneOf(['Point']).required(),
  coordinates: array().of(number().required()).min(2).max(3).required()
});

// TODO
const areaGeometrySchema = object().shape({});
// ^------------------------------------------^ //

const infraoObstacleSchema = object().shape({
  type: mixed().oneOf(['Feature']).required(),
  id: string()
    .required()
    .matches(/(^\D+\.\d+$)/), // e.g. "Rakenne.123456789"
  geometry: pointGeometrySchema.required(),
  properties: object().shape({
    yksilointitieto: number().required(),
    alkuHetki: date().required(),
    loppuHetki: date().min(new Date()).notRequired(),
    malli: mixed().oneOf(['Pollari', 'Puomi']).required(),
    rakenne: mixed().oneOf(['kulkuesteet (pollarit, puomit)']).required()
  })
});

const infraoTrafficSignSchema = object().shape({
  type: mixed().oneOf(['Feature']).required(),
  id: string()
    .required()
    .matches(/(^\D+\.\d+$)/), // e.g. "Liikennemerkki.123456789"
  geometry: pointGeometrySchema.required(),
  properties: object().shape({
    yksilointitieto: number().required(),
    alkuHetki: date().required(),
    loppuHetki: date().min(new Date()).notRequired(),
    suunta: number().notRequired().max(360).min(0),
    // required when liikennemerkkityyppi is speed limit sign
    teksti: string().when('liikennemerkkityyppi2020', {
      is: (liikennemerkkityyppi2020: string) =>
        // TODO: Correct this
        trafficSignsWithTextValue.includes(
          liikennemerkkityyppi2020.split(' ')[0]
        ),
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.notRequired()
    }),
    // TODO: implement conditional formatting for new traffic sign codes
    liikennemerkkityyppi: string(),
    liikennemerkkityyppi2020: string().required()
  })
});
export { infraoJsonSchema, infraoObstacleSchema, infraoTrafficSignSchema };
