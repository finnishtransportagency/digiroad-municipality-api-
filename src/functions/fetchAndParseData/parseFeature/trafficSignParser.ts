import { Feature } from '@customTypes/featureTypes';
import { trafficSignFeatureSchema } from '@schemas/geoJsonSchema';
import { infraoTrafficSignSchema } from '@schemas/muniResponseSchema';
import { createTrafficSignText, trafficSignRules } from '@schemas/trafficSignTypes';

export default (feature: unknown): Feature => {
  const castedFeature = infraoTrafficSignSchema.cast(feature);
  const properties = castedFeature.properties;
  const id = properties.yksilointitieto;

  if (!infraoTrafficSignSchema.isValidSync(castedFeature))
    return {
      type: 'Invalid',
      id: id,
      properties: {
        reason: 'Does not match infraoTrafficSignSchema',
        feature: JSON.stringify(feature)
      }
    };

  const trafficSignCode =
    properties.liikennemerkkityyppi2020 === 'INVALID_CODE'
      ? properties.liikennemerkkityyppi
      : properties.liikennemerkkityyppi2020;

  if (trafficSignCode === 'INVALID_CODE')
    return {
      type: 'Invalid',
      id: id,
      properties: {
        reason: 'Invalid liikennemerkkityyppi & liikennemerkkityyppi2020',
        feature: JSON.stringify(feature)
      }
    };

  const coordinates = castedFeature.geometry.coordinates;

  return trafficSignFeatureSchema.cast({
    type: 'Feature',
    id: castedFeature.id,
    properties: {
      TYPE: trafficSignCode[0] === 'H' ? 'ADDITIONALPANEL' : 'TRAFFICSIGN',
      ID: String(id),
      SUUNTIMA: properties.suunta ? properties.suunta * (180 / Math.PI) : 0,
      LM_TYYPPI: createTrafficSignText(trafficSignCode),
      // TODO: Set ARVO only on corresponding traffic signs. e.g. speed limit signs (check trafficSignRules)
      ARVO: Object.keys(trafficSignRules).includes(properties.liikennemerkkityyppi2020)
        ? Number(properties.teksti)
        : null,
      TEKSTI: properties.teksti ? properties.teksti.substring(0, 128) : properties.teksti,
      ...(!(trafficSignCode[0] === 'H') && {
        LISAKILVET: []
      })
    },
    geometry: {
      type: 'Point',
      coordinates: [coordinates[0], coordinates[1]]
    }
  });
};
