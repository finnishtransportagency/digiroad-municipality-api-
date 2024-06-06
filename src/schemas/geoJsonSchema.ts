import { InferType, array, mixed, number, object, string } from 'yup';
import {
  allowedAdditionalPanel,
  allowedTrafficSigns
} from './trafficSignTypes';

// v--------------- PROPERTIES ---------------v //
/**
 * @field EST_TYYPPI: 1 = Suljettu yhteys, 2 = Avattava puomi
 */
const obstaclePropertiesSchema = object().shape({
  TYPE: mixed().oneOf(['OBSTACLE']).required(),
  ID: string().required(),
  EST_TYYPPI: number().required().oneOf([1, 2])
});

/**
 * @field KOKO: 1 = Pienikokoinen merkki, 2 = Normaalikokoinen merkki (oletus), 3 = Suurikokoinen merkki
 * @field KALVON_TYYPPI: 1 = R1-luokan kalvo, 2 = R2-luokan kalvo, 3 = R3-luokan kalvo
 * @field VARI: 1 = Sininen, 2 = Keltainen
 */
const additionalPanelPropertiesSchema = object().shape({
  TYPE: mixed().oneOf(['ADDITIONALPANEL']).required(),
  ID: string().required(),
  SUUNTIMA: number().max(360).min(0),
  LM_TYYPPI: string().required().oneOf(allowedAdditionalPanel),
  ARVO: number().notRequired(),
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
const trafficSignPropertiesSchema = object().shape({
  TYPE: mixed().oneOf(['TRAFFICSIGN']).required(),
  ID: string().required(),
  SUUNTIMA: number().required().max(360).min(0),
  LM_TYYPPI: string().required().oneOf(allowedTrafficSigns),
  ARVO: number().notRequired(),
  TEKSTI: string().notRequired(),
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
});

// TODO implement all fields
const surfacePropertiesSchema = object().shape({
  TYPE: mixed().oneOf(['SURFACE']).required()
});
// ^------------------------------------------^ //

// v--------------- GEOMETRIES ---------------v //
const pointGeometrySchema = object().shape({
  type: mixed().oneOf(['Point']).required(),
  coordinates: array().of(number().required()).length(2).required()
});

// TODO
const areaGeometrySchema = object().shape({});
// ^------------------------------------------^ //

// v---------------- FEATURES ----------------v //
const obstacleFeatureSchema = object().shape({
  type: mixed().oneOf(['Feature']).required(),
  id: string().required(),
  properties: obstaclePropertiesSchema,
  geometry: pointGeometrySchema.required()
});

const trafficSignFeatureSchema = object().shape({
  type: mixed().oneOf(['Feature']).required(),
  id: string().required(),
  properties: trafficSignPropertiesSchema,
  geometry: pointGeometrySchema.required()
});

const additionalPanelFeatureSchema = object().shape({
  type: mixed().oneOf(['Feature']).required(),
  id: string().required(),
  properties: additionalPanelPropertiesSchema,
  geometry: pointGeometrySchema.required()
});

const roadSurfaceFeatureSchema = object().shape({
  type: mixed().oneOf(['Feature']).required(),
  id: string().required(),
  properties: surfacePropertiesSchema,
  geometry: areaGeometrySchema.required()
});
// ^------------------------------------------^ //

type ValidFeature =
  | InferType<typeof obstacleFeatureSchema>
  | InferType<typeof trafficSignFeatureSchema>
  | InferType<typeof additionalPanelFeatureSchema>
  | InferType<typeof roadSurfaceFeatureSchema>;

interface InvalidFeature {
  type: 'Invalid';
  id: number;
  properties: {
    reason: string;
    feature: string;
  };
}

type Feature = ValidFeature | InvalidFeature;

interface FeatureCollection {
  type: 'FeatureCollection';
  name: string;
  crs: {
    type: 'name';
    properties: {
      name: 'urn:ogc:def:crs:EPSG::3067';
    };
  };
  features: Array<Feature>;
  invalidInfrao: {
    sum: number;
    IDs: Array<number>;
  };
}

export {
  ValidFeature,
  InvalidFeature,
  Feature,
  FeatureCollection,
  obstacleFeatureSchema,
  trafficSignFeatureSchema,
  additionalPanelFeatureSchema,
  roadSurfaceFeatureSchema
};
