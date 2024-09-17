import { array, boolean, number, object, string } from 'yup';
import {
  allowedAdditionalPanels,
  allowedSpeedLimits,
  allowedTrafficSigns,
  trafficSignRules
} from '@schemas/trafficSignTypes';
import { pointGeometrySchema } from './geometrySchema';

enum GeoJsonFeatureType {
  Obstacle = 'OBSTACLE',
  AdditionalPanel = 'ADDITIONALPANEL',
  TrafficSign = 'TRAFFICSIGN'
}

// v--------------- PROPERTIES ---------------v //
/**
 * @field EST_TYYPPI: 1 = Suljettu yhteys, 2 = Avattava puomi
 */
const obstaclePropertiesSchema = object({
  TYPE: string().oneOf([GeoJsonFeatureType.Obstacle]).required(),
  ID: string().required(),
  EST_TYYPPI: number().required().oneOf([1, 2]),
  DR_LINK_ID: string().notRequired(),
  DR_M_VALUE: number().notRequired(),
  DR_OFFSET: number().notRequired(),
  DR_GEOMETRY: object({
    x: number().notRequired(),
    y: number().notRequired(),
    z: number().default(0).notRequired()
  }).notRequired()
});

const trafficSignValueSchema = number().when('LM_TYYPPI', ([LM_TYYPPI], schema) => {
  if (typeof LM_TYYPPI !== 'string') return schema.notRequired();
  const typeRules = trafficSignRules[LM_TYYPPI.split(' ')[0]];
  switch (typeRules.unit) {
    case 'km/h':
      return schema.oneOf(allowedSpeedLimits).required();
    case null:
      return schema.notRequired();
    default:
      if (!typeRules.minValue || !typeRules.maxValue) return schema.notRequired();
      return schema.min(typeRules.minValue).max(typeRules.maxValue).required();
  }
});

/**
 * @field KOKO: 1 = Pienikokoinen merkki, 2 = Normaalikokoinen merkki (oletus), 3 = Suurikokoinen merkki
 * @field KALVON_TYYPPI: 1 = R1-luokan kalvo, 2 = R2-luokan kalvo, 3 = R3-luokan kalvo
 * @field VARI: 1 = Sininen, 2 = Keltainen
 */
const additionalPanelPropertiesSchema = object({
  TYPE: string().oneOf([GeoJsonFeatureType.AdditionalPanel]).required(),
  ID: string().required(),
  SUUNTIMA: number().notRequired().max(360).min(0),
  LM_TYYPPI: string().required().oneOf(allowedAdditionalPanels),
  ARVO: trafficSignValueSchema,
  TEKSTI: string().notRequired(),
  KOKO: number().oneOf([1, 2, 3]).notRequired(),
  KALVON_TYYPPI: number().oneOf([1, 2, 3]).notRequired(),
  VARI: number().oneOf([1, 2]).notRequired()
});

/**
 * @field RAKENNE: 1 = Pylväs, 2 = Seinä, 3 = Silta, 4 = Portaali, 5 = Puoliportaali, 6 = Puomi tai muu esterakennelma, 7 = Muu
 * @field KUNTO: 1 = Erittäin huono, 2 = Huono, 3 = Tyydyttävä, 4 = Hyvä, 5 = Erittäin hyvä
 * @field KOKO: 1 = Pienikokoinen merkki, 2 = Normaalikokoinen merkki (oletus), 3 = Suurikokoinen merkki
 */
const trafficSignPropertiesSchema = object({
  TYPE: string().oneOf([GeoJsonFeatureType.TrafficSign]).required(),
  ID: string().required(),
  SUUNTIMA: number().required().max(360).min(0),
  LM_TYYPPI: string().required().oneOf(allowedTrafficSigns),
  ARVO: trafficSignValueSchema,
  TEKSTI: string().max(128).notRequired(),
  LISATIETO: string().notRequired(),
  RAKENNE: number().oneOf([1, 2, 3, 4, 5, 6]).notRequired(),
  KUNTO: number().oneOf([1, 2, 3, 4, 5]).notRequired(),
  KOKO: number().oneOf([1, 2, 3]).notRequired(),
  LISAKILVET: array()
    .of(additionalPanelPropertiesSchema)
    .when('LM_TYYPPI', {
      is: (value: string) => value[0] === 'H',
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required().max(5)
    })
    .required()
}).required();
// ^------------------------------------------^ //

// v---------------- FEATURES ----------------v //
const obstacleFeatureSchema = object({
  type: string().oneOf(['Feature']).required(),
  id: string().required(),
  properties: obstaclePropertiesSchema,
  geometry: pointGeometrySchema.required()
});

const trafficSignFeatureSchema = object({
  type: string().oneOf(['Feature']).required(),
  id: string().required(),
  properties: trafficSignPropertiesSchema,
  geometry: pointGeometrySchema.required()
});

const additionalPanelFeatureSchema = object({
  type: string().oneOf(['Feature']).required(),
  id: string().required(),
  properties: additionalPanelPropertiesSchema,
  geometry: pointGeometrySchema.required()
});

// ^------------------------------------------^ //

/**
 * Shallow check for the most important fields.
 * Contents of the features array are not checked!!!
 */
const geoJsonSchema = object({
  type: string().oneOf(['FeatureCollection']).required(),
  name: string().required(),
  crs: object({
    type: string().oneOf(['name']).required(),
    properties: object({
      name: string().oneOf(['urn:ogc:def:crs:EPSG::3067']).required()
    }).required()
  }).required(),
  features: array().required(), // Content in not checked
  invalidInfrao: object({
    sum: number().required(),
    IDs: array().default([]).of(string().required()).min(0).required()
  }).required()
}).required();

export {
  GeoJsonFeatureType,
  geoJsonSchema,
  obstacleFeatureSchema,
  trafficSignFeatureSchema,
  additionalPanelFeatureSchema
};
