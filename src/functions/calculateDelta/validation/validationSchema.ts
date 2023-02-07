import * as yup from 'yup';
import {
  allowedAdditionalSigns,
  allowedTrafficSigns
} from './trafficSignTypes';

yup.addMethod(yup.object, 'oneOfSchemas', function (schemas) {
  return this.test(
    'one-of-schemas',
    'Feature does not match one of the allowed schemas',
    (item) => {
      return schemas.some((schema) =>
        schema.isValidSync(item, { strict: true })
      );
    }
  );
});

yup.addMethod(yup.array, 'oneOfSchemasArray', function (schemas) {
  return this.test(
    'one-of-schemas',
    'Not all features match one of the allowed schemas',
    (items) =>
      items.every((item) => {
        return schemas.some((schema) =>
          schema.isValidSync(item, { strict: true })
        );
      })
  );
});

const additionalSigns = yup.object().shape({
  LK_TYYPPI: yup.string().required().oneOf(allowedAdditionalSigns),
  ARVO: yup.number().notRequired(),
  TEKSTI: yup.string().notRequired(),
  KOKO: yup.number().oneOf([1, 2, 3]).notRequired(),
  KALVON_TYYPPI: yup.number().oneOf([1, 2, 3]).notRequired(),
  VARI: yup.number().oneOf([1, 2]).notRequired()
});

const trafficSignPropertiesSchema = yup.object().shape({
  type: yup
    .string()
    .required()
    .matches(/(TRAFFICSIGN)/),
  ID: yup.string().required(),
  SUUNTIMA: yup.number().required().max(360).min(0),
  LM_TYYPPI: yup.string().required().oneOf(allowedTrafficSigns),
  ARVO: yup.number().notRequired(),
  TEKSTI: yup.string().notRequired(),
  LISATIETO: yup.string().notRequired(),
  RAKENNE: yup.number().oneOf([1, 2, 3, 4, 5, 6]).notRequired(),
  KUNTO: yup.number().oneOf([1, 2, 3, 4, 5]).notRequired(),
  KOKO: yup.number().oneOf([1, 2, 3]).notRequired(),
  LISAKILVET: yup.array().of(additionalSigns)
});

const obstaclePropertiesSchema = yup.object().shape({
  type: yup
    .string()
    .required()
    .matches(/(OBSTACLE)/),
  ID: yup.string().required(),
  EST_TYYPPI: yup.number().required().oneOf([1, 2])
});

const pointGeometrySchema = yup.object().shape({
  type: yup
    .string()
    .required()
    .matches(/(Point)/),
  coordinates: yup.array().of(yup.number().required()).length(2)
});

const pointFeatureSchema = yup.object().shape({
  type: yup.string().required(),
  properties: yup
    .object()
    .oneOfSchemas([obstaclePropertiesSchema, trafficSignPropertiesSchema])
    .required(),
  geometry: pointGeometrySchema.required()
});

const crsSchema = yup.object().shape({
  type: yup.string().notRequired(),
  properties: yup
    .object()
    .shape({
      name: yup.string().notRequired()
    })
    .notRequired()
});

const schema = yup.object().shape({
  type: yup.string().required(),
  name: yup.string().notRequired(),
  crs: crsSchema.notRequired(),
  features: yup.array().oneOfSchemasArray([pointFeatureSchema])
});

export { schema, obstaclePropertiesSchema };
