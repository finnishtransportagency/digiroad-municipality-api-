import { Feature } from '@customTypes/featureTypes';
import { invalidFeature } from '@libs/schema-tools';
import { GeoJsonFeatureType, trafficSignFeatureSchema } from '@schemas/geoJsonSchema';
import { infraoTrafficSignSchema } from '@schemas/muniResponseSchema';
import { createTrafficSignText } from '@schemas/trafficSignTypes';

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

  const value = parseInt(properties.teksti ?? '');

  return trafficSignFeatureSchema.cast({
    type: 'Feature',
    id: castedFeature.id,
    properties: {
      TYPE:
        trafficSignCode[0] === 'H'
          ? GeoJsonFeatureType.AdditionalPanel
          : GeoJsonFeatureType.TrafficSign,
      ID: String(id),
      SUUNTIMA: properties.suunta ? properties.suunta * (180 / Math.PI) : 0,
      LM_TYYPPI: createTrafficSignText(trafficSignCode),
      ARVO: isNaN(value) ? undefined : value,
      TEKSTI: properties.teksti ? properties.teksti.substring(0, 128) : properties.teksti,
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
