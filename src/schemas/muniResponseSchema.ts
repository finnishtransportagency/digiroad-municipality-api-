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

const helsinkiJsonSchema = object({
  count: number().required(),
  results: array().required(),
  next: string().notRequired()
}).required();

const infraoObstacleSchema = object({
  type: string().oneOf(['Feature']).required(),
  id: string()
    .matches(/(^\D+\.\d+$)/)
    .required(), // e.g. "Rakenne.123456789"
  geometry: pointGeometrySchema.required(),
  properties: object({
    yksilointitieto: string().required(),
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
    yksilointitieto: string().required(),
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

const helsinkiSignSchema = object({
  id: string().required(),
  location: pointGeometrySchema.required(),
  device_type: string().required(),
  lifecycle: number().oneOf([3, 4, 5, 6]).notRequired(),
  condition: number().oneOf([1, 2, 3, 4, 5]).notRequired(),
  road_name: string().notRequired(),
  lane_type: number()
    .oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 20, 21, 22])
    .notRequired(),
  lane_number: string()
    .oneOf(['11', '21', '31', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'X8', 'X9'])
    .notRequired(),
  direction: number().required().max(360).min(0),
  height: number().notRequired().min(0),
  value: string().notRequired(),
  size: number()
    .oneOf([1, 2, 3])
    .transform((code: string) => {
      return code === 'S' ? 1 : 'M' ? 2 : 3;
    })
    .notRequired(),
  reflection_class: number()
    .oneOf([1, 2, 3])
    .transform((code: string) => {
      return code === 'R1' ? 1 : code === 'R2' ? 2 : 3;
    })
    .notRequired(),
  txt: string().notRequired(),
  location_specifier: string().notRequired()
});

const helsinkiTrafficSignMapSchema = object({
  id: string().required(),
  legacy_code: string()
    .default('INVALID_CODE')
    .when('code', {
      is: 'INVALID_CODE',
      then: (schema) =>
        schema
          .transform((value: string) => {
            if (!value) return 'INVALID_CODE';
            const splitType = value
              .trim()
              .match(/(^[A-I]\d{1,2}(\.\d{1,2})?)|(^[1-9]\d{0,3}$)/);
            if (!splitType) return 'INVALID_CODE';
            const code = splitType[0];
            if (Object.keys(trafficSignRules).includes(code)) return code;
            const mapping = oldTrafficSignMapping[code];
            if (!mapping) return 'INVALID_CODE';
            return mapping.code.default ?? 'INVALID_CODE';
          })
          .required(),
      otherwise: (schema) => schema.notRequired()
    }),
  code: string()
    .transform((value: string) => {
      if (!value) return 'INVALID_CODE';
      const splitType = value
        .trim()
        .match(/(^[A-I]\d{1,2}(\.\d{1,2})?)|(^[1-9]\d{0,3}$)/);
      if (!splitType) return 'INVALID_CODE';
      const code = splitType[0];
      if (Object.keys(trafficSignRules).includes(code)) return code;
      const mapping = oldTrafficSignMapping[code];
      if (!mapping) return 'INVALID_CODE';
      return mapping.code.default ?? 'INVALID_CODE';
    })
    .required()
}).required();

const helsinkiAdditionalPanelSchema = object({
  id: string().required(),
  location: pointGeometrySchema.required(),
  device_type: string().notRequired(),
  value: string().notRequired(),
  direction: number().notRequired().max(360).min(0),
  size: number()
    .oneOf([1, 2, 3])
    .transform((code: string) => {
      return code === 'S' ? 1 : 'M' ? 2 : 3;
    })
    .notRequired(),
  reflection_class: number()
    .oneOf([1, 2, 3])
    .transform((code: string) => {
      return code === 'R1' ? 1 : code === 'R2' ? 2 : 3;
    })
    .notRequired(),
  txt: string().notRequired()
});

export {
  infraoJsonSchema,
  infraoObstacleSchema,
  infraoTrafficSignSchema,
  helsinkiJsonSchema,
  helsinkiSignSchema,
  helsinkiTrafficSignMapSchema,
  helsinkiAdditionalPanelSchema
};
