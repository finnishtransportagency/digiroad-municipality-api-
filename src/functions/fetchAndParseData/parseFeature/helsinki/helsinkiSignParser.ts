import {
  AdditionalPanelParseObject,
  AdditionalPanelType,
  InvalidFeature,
  TrafficSignType
} from '@customTypes/featureTypes';
import { SignMap } from '@customTypes/mapTypes';
import { invalidFeature } from '@libs/schema-tools';
import { helsinkiCoordTransform } from '@libs/spatial-tools';
import {
  additionalPanelFeatureSchema,
  GeoJsonFeatureType,
  trafficSignFeatureSchema
} from '@schemas/geoJsonSchema';
import {
  helsinkiAdditionalPanelSchema,
  helsinkiSignSchema
} from '@schemas/muniResponseSchema';
import { createTrafficSignText, trafficSignRules } from '@schemas/trafficSignTypes';

export default (
  feature: unknown,
  signMap: Array<SignMap>,
  isAdditionalPanel: boolean,
  additionalPanels?: AdditionalPanelParseObject['additionalPanels']
): TrafficSignType | AdditionalPanelType | InvalidFeature => {
  const castSchema = isAdditionalPanel
    ? helsinkiAdditionalPanelSchema
    : helsinkiSignSchema;
  const castedFeature = castSchema.cast(feature);
  const id = castedFeature.id;
  const deviceTypeId = castedFeature.device_type;
  const sign = signMap.find((item) => item.id === deviceTypeId);
  const legacy_code = sign ? sign.legacy_code : 'INVALID_CODE';
  const code = sign ? sign.code : 'INVALID_CODE';
  const finalCode = code !== 'INVALID_CODE' ? code : legacy_code;

  if (!castSchema.isValidSync(castedFeature))
    return invalidFeature(
      feature,
      `Does not match ${
        isAdditionalPanel ? 'helsinkiAdditionalPanelSchema' : 'helsinkiSignSchema'
      }`
    );

  if (finalCode === 'INVALID_CODE')
    return invalidFeature(feature, 'Invalid traffic sign code');

  const schema = isAdditionalPanel
    ? additionalPanelFeatureSchema
    : trafficSignFeatureSchema;

  const numberValue = Number(castedFeature.value);
  const panels = additionalPanels ? additionalPanels[id] ?? [] : [];
  const gk25coordinates = castedFeature.location.coordinates;
  const projectedCoordinates = helsinkiCoordTransform([
    gk25coordinates[0],
    gk25coordinates[1]
  ]);

  return schema.cast({
    type: 'Feature',
    id,
    properties: {
      TYPE: isAdditionalPanel
        ? GeoJsonFeatureType.AdditionalPanel
        : GeoJsonFeatureType.TrafficSign,
      ID: id,
      SUUNTIMA: Math.round(castedFeature.direction ? castedFeature.direction : 0),
      LM_TYYPPI: createTrafficSignText(finalCode),
      ARVO:
        Object.keys(trafficSignRules).includes(finalCode) && !isNaN(numberValue)
          ? numberValue
          : null,
      TEKSTI: castedFeature.txt ? castedFeature.txt.substring(0, 128) : castedFeature.txt,
      ...(isAdditionalPanel ? {} : { LISAKILVET: panels })
    },
    geometry: {
      type: 'Point',
      coordinates: [...projectedCoordinates, 0]
    }
  });
};
