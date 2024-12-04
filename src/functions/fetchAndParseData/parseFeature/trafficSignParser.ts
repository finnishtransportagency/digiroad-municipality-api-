import { Feature } from '@customTypes/featureTypes';
import { invalidFeature, transformValueToUnit } from '@libs/schema-tools';
import { GeoJsonFeatureType, trafficSignFeatureSchema } from '@schemas/geoJsonSchema';
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
  const rawValue = match
    ? Math.round(parseFloat(match[1].replace(',', '.')) * 1000) / 1000
    : NaN;
  const unit = match ? match[2]?.toLowerCase() : null;
  const isValueSign =
    Object.keys(trafficSignRules).includes(trafficSignCode) &&
    trafficSignRules[trafficSignCode].unit;
  const assumedUnit = isValueSign ? trafficSignRules[trafficSignCode].unit : undefined;

  const value = (() => {
    if (isNaN(rawValue)) return rawValue;
    if (assumedUnit && unit) {
      return transformValueToUnit(rawValue, assumedUnit, unit);
    }
    if (assumedUnit === 'kg' && rawValue < 100) {
      return rawValue * 1000;
    }
    if (assumedUnit === 'min' && rawValue < 25 && ![5, 10, 15, 20].includes(rawValue)) {
      return rawValue * 60;
    }
    return rawValue;
  })();

  return trafficSignFeatureSchema.cast({
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
      ARVO: !isNaN(value) && isValueSign ? value : undefined,
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
};
