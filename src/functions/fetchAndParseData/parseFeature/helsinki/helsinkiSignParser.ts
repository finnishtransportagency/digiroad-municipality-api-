import { Feature } from '@customTypes/featureTypes';
import { SignMap } from '@customTypes/mapTypes';
import { GeoJsonFeatureType, trafficSignFeatureSchema } from '@schemas/geoJsonSchema';
import { helsinkiSignSchema } from '@schemas/muniResponseSchema';
import { createTrafficSignText, trafficSignRules } from '@schemas/trafficSignTypes';

export default (feature: unknown, signMap: Array<SignMap>): Feature => {
  const castedFeature = helsinkiSignSchema.cast(feature);
  const id = castedFeature.id;
  const typeId = castedFeature.device_type;
  const sign = signMap.find((item) => item.id === typeId);
  const legacy_code = sign ? sign.legacy_code : 'INVALID_CODE';
  const code = sign ? sign.code : 'INVALID_CODE';
  const finalCode = code !== 'INVALID_CODE' ? code : legacy_code;

  if (!helsinkiSignSchema.isValidSync(castedFeature))
    return {
      type: 'Invalid',
      id: id,
      properties: {
        reason: 'Does not match helsinkiSignSchema',
        feature: JSON.stringify(feature)
      }
    };

  if (finalCode === 'INVALID_CODE')
    return {
      type: 'Invalid',
      id: id,
      properties: {
        reason: 'Invalid traffic sign code',
        feature: JSON.stringify(feature)
      }
    };

  return trafficSignFeatureSchema.cast({
    type: 'Feature',
    id,
    properties: {
      TYPE: GeoJsonFeatureType.TrafficSign,
      ID: id,
      SUUNTIMA: castedFeature.direction,
      LM_TYYPPI: createTrafficSignText(finalCode),
      ARVO: Object.keys(trafficSignRules).includes(finalCode)
        ? Number(castedFeature.value)
        : null,
      TEKSTI: castedFeature.txt ? castedFeature.txt.substring(0, 128) : castedFeature.txt,
      LISAKILVET: []
    },
    geometry: {
      type: 'Point',
      coordinates: castedFeature.location.coordinates
    }
  });
};
