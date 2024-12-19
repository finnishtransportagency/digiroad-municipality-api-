import { Feature } from '@customTypes/featureTypes';
import { convertUnit, invalidFeature } from '@libs/schema-tools';
import {
  additionalPanelFeatureSchema,
  GeoJsonFeatureType,
  trafficSignFeatureSchema
} from '@schemas/geoJsonSchema';
import { infraoTrafficSignSchema } from '@schemas/muniResponseSchema';
import { createTrafficSignText, trafficSignRules } from '@schemas/trafficSignTypes';

export default (feature: unknown): Feature => {
  const castedFeature = infraoTrafficSignSchema.cast(feature);
  const properties = castedFeature.properties;
  const id = properties.yksilointitieto;

  if (!infraoTrafficSignSchema.isValidSync(castedFeature))
    return invalidFeature(feature, 'Does not match infraoTrafficSignSchema');

  const trafficSignCode =
    properties.liikennemerkkityyppi2020 === 'INVALID_CODE'
      ? properties.liikennemerkkityyppi
      : properties.liikennemerkkityyppi2020;

  if (trafficSignCode === 'INVALID_CODE')
    return invalidFeature(
      feature,
      'Invalid liikennemerkkityyppi & liikennemerkkityyppi2020'
    );

  const text = properties.teksti;
  const match = text
    ? text.match(/\b(\d+(?:[.,]\d+)?)\s*(h|min|cm|m|km|kg|t)?\b/i)
    : null;
  const rawValue = match ? parseFloat(match[1].replace(',', '.')) : NaN;
  const unit = match && match[2] ? match[2].toLowerCase() : null;

  const value = convertUnit(trafficSignCode, rawValue, unit);

  const castedTrafficSign = trafficSignFeatureSchema.cast({
    type: 'Feature',
    id: castedFeature.id,
    properties: {
      TYPE:
        trafficSignCode[0] === 'H'
          ? GeoJsonFeatureType.AdditionalPanel
          : GeoJsonFeatureType.TrafficSign,
      ID: String(id),
      SUUNTIMA: Math.round(properties.suunta ? properties.suunta * (180 / Math.PI) : 0), // MAYBE SHOULD RETURN InvalidFeature in case of no bearing.
      LM_TYYPPI: createTrafficSignText(trafficSignCode),
      ARVO: !isNaN(value) && trafficSignRules[trafficSignCode].unit ? value : undefined,
      TEKSTI: text ? text.substring(0, 128) : text,
      ...(!(trafficSignCode[0] === 'H') && {
        LISAKILVET: []
      })
    },
    geometry: {
      type: 'Point',
      coordinates: castedFeature.geometry.coordinates
    }
  });

  /**
   * This works, because each sign type can only be either traffic signs or additional panels.
   */
  if (
    !trafficSignFeatureSchema.isValidSync(castedTrafficSign) &&
    !additionalPanelFeatureSchema.isValidSync(castedTrafficSign)
  )
    return invalidFeature(
      feature,
      'Does not match trafficSignFeatureSchema or additionalPanelFeatureSchema'
    );

  return castedTrafficSign;
};
