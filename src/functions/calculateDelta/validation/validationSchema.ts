import * as yup from 'yup';
import {
  allowedAdditionalPanel,
  allowedTrafficSigns
} from './trafficSignTypes.js';

const additionalPanel = yup.object().shape({
  LK_TYYPPI: yup.string().required().oneOf(allowedAdditionalPanel),
  ARVO: yup.number().notRequired(),
  TEKSTI: yup.string().notRequired(),
  KOKO: yup.number().oneOf([1, 2, 3]).notRequired(),
  KALVON_TYYPPI: yup.number().oneOf([1, 2, 3]).notRequired(),
  VARI: yup.number().oneOf([1, 2]).notRequired()
});

const trafficSignPropertiesSchema = yup.object().shape({
  TYPE: yup
    .string()
    .required()
    .matches(/(^TRAFFICSIGN$)/),
  ID: yup.string().required(),
  SUUNTIMA: yup.number().max(360).min(0),
  LM_TYYPPI: yup.string().required().oneOf(allowedTrafficSigns),
  ARVO: yup.number().notRequired(),
  TEKSTI: yup.string().notRequired(),
  LISATIETO: yup.string().notRequired(),
  RAKENNE: yup.number().oneOf([1, 2, 3, 4, 5, 6]).notRequired(),
  KUNTO: yup.number().oneOf([1, 2, 3, 4, 5]).notRequired(),
  KOKO: yup.number().oneOf([1, 2, 3]).notRequired(),
  LISAKILVET: yup.array().of(additionalPanel).notRequired().max(3)
});

const obstaclePropertiesSchema = yup.object().shape({
  TYPE: yup
    .string()
    .required()
    .matches(/(^OBSTACLE$)/),
  ID: yup.string().required(),
  EST_TYYPPI: yup.number().required().oneOf([1, 2])
});

const pointGeometrySchema = yup.object().shape({
  type: yup
    .string()
    .required()
    .matches(/(^Point$)/),
  coordinates: yup.array().of(yup.number().required()).length(2)
});

const obstacleFeatureSchema = yup.object().shape({
  type: yup.string().required(),
  properties: obstaclePropertiesSchema,
  geometry: pointGeometrySchema.required()
});

const trafficSignFeatureSchema = yup.object().shape({
  type: yup.string().required(),
  properties: trafficSignPropertiesSchema,
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

const obstaclesSchema = yup.object().shape({
  type: yup.string().required(),
  name: yup.string().notRequired(),
  crs: crsSchema.notRequired(),
  features: yup.array().of(obstacleFeatureSchema).required()
});

const trafficSignsSchema = yup.object().shape({
  type: yup.string().required(),
  name: yup.string().notRequired(),
  crs: crsSchema.notRequired(),
  features: yup.array().of(trafficSignFeatureSchema).required()
});

export { trafficSignsSchema, obstaclesSchema, obstaclePropertiesSchema };
