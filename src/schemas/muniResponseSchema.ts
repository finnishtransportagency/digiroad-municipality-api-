import { array, date, number, object, ref, string } from 'yup';
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

const createModel = (fullModel: string) => {
  const allowedModels = ['pollari', 'puomi', 'betoniporsas', 'sulkuportti'];
  return allowedModels.find((keyword) => fullModel.toLowerCase().includes(keyword));
};

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
    malli: string()
      .transform(createModel)
      .oneOf(['pollari', 'puomi', 'betoniporsas', 'sulkuportti'])
      .required(),
    rakenne: string().oneOf(['kulkuesteet (pollarit, puomit)']).required()
  }).required()
}).required();

const mapSignCode = (fullCode: string) => {
  if (!fullCode) return 'INVALID_CODE';
  const splitType = fullCode.trim().split(' '); // e.g. ['A10'] or ['141.a', 'Töyssyjä']
  const codeNumber = splitType[0];
  const match = codeNumber.match(/^([A-I]\d+)(?:\.(\d+))?/);
  if (match) {
    const baseCode = match[1]; // "E4"
    const firstSubNumber = match[2]; // "1", or undefined if no sub-number exists

    if (firstSubNumber) {
      const fullCodeKey = `${baseCode}.${firstSubNumber}`; // "E4.1"
      if (Object.keys(trafficSignRules).includes(fullCodeKey)) {
        return fullCodeKey; // Return "E4.1" if it exists in trafficSignRules
      }
    }
    if (Object.keys(trafficSignRules).includes(baseCode)) return baseCode;
  }
  const pointSplit = fullCode.trim().split(/[^a-zA-Z0-9]+/);
  const mapping = oldTrafficSignMapping[pointSplit[0]];
  if (!mapping) return 'INVALID_CODE';
  if (mapping.hasSubCode) return mapping.code[pointSplit[1]] ?? mapping.code.default;
  return mapping.code.default ?? 'INVALID_CODE';
};

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
      .transform(mapSignCode)
      .required(),
    liikennemerkkityyppi2020: string()
      .default('INVALID_CODE')
      .transform(mapSignCode)
      .required()
  }).required()
}).required();

const helsinkiCommonValuesSchema = object({
  id: string().required(),
  location: pointGeometrySchema.required(),
  device_type: string().required(),
  lifecycle: number().oneOf([3, 4, 5, 6]).required(),
  condition: number().oneOf([1, 2, 3, 4, 5]).notRequired(),
  height: number().notRequired().min(0),
  size: number()
    .oneOf([1, 2, 3])
    .transform((code: string) => {
      switch (code) {
        case 'S':
          return 1;
        case 'M':
          return 2;
        case 'L':
          return 3;
        default:
          break;
      }
    })
    .notRequired(),
  reflection_class: number()
    .oneOf([1, 2, 3])
    .transform((code: string) => {
      switch (code) {
        case 'R1':
          return 1;
        case 'R2':
          return 2;
        case 'R3':
          return 3;
        default:
          break;
      }
    })
    .notRequired()
});

const helsinkiSignSchema = helsinkiCommonValuesSchema.shape({
  direction: number().required().max(360).min(0),
  road_name: string().notRequired(),
  lane_type: number()
    .oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 20, 21, 22])
    .notRequired(),
  lane_number: string()
    .oneOf(['11', '21', '31', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'X8', 'X9'])
    .notRequired(),
  txt: string().notRequired(),
  value: string().notRequired(),
  location_specifier: string().notRequired(),
  mount_real: string().notRequired()
});

const helsinkiTrafficSignMapSchema = object({
  id: string().required(),
  legacy_code: string()
    .default('INVALID_CODE')
    .when('code', {
      is: 'INVALID_CODE',
      then: (schema) => schema.transform(mapSignCode).required(),
      otherwise: (schema) => schema.notRequired()
    }),
  code: string().transform(mapSignCode).required()
}).required();

const helsinkiAdditionalPanelSchema = helsinkiCommonValuesSchema.shape({
  value: ref<string>('content_s.limit'),
  content_s: object({
    unit: string().notRequired(),
    limit: string().notRequired()
  }).notRequired(),
  direction: number()
    .transform((value) => (value >= 0 ? value % 360 : 360 + (value % 360)))
    .max(360)
    .min(0)
    .notRequired(),
  txt: ref<string>('additional_information'),
  additional_information: string().notRequired()
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
