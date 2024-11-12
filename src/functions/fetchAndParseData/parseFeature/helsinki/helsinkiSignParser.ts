import {
  AdditionalPanelParseObject,
  AdditionalPanelType,
  InvalidFeature,
  TrafficSignType
} from '@customTypes/featureTypes';
import { SignMap } from '@customTypes/mapTypes';
import { invalidFeature } from '@libs/schema-tools';
import { helsinkiCoordTransform, oppositeBearing } from '@libs/spatial-tools';
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
  if (![3, 4].includes(castedFeature.lifecycle))
    return invalidFeature(feature, `Lifecycle not active: ${castedFeature.lifecycle}`);
  const id = castedFeature.id;
  const deviceTypeId = castedFeature.device_type;
  const sign = signMap.find((item) => item.id === deviceTypeId);
  const legacy_code = sign ? sign.legacy_code : 'INVALID_CODE';
  const code = sign ? sign.code : 'INVALID_CODE';
  const finalCode = code !== 'INVALID_CODE' ? code : legacy_code;

  if (finalCode === 'INVALID_CODE')
    return invalidFeature(feature, 'Invalid traffic sign code');

  if (!castSchema.isValidSync(castedFeature))
    return invalidFeature(
      feature,
      `Does not match ${
        isAdditionalPanel ? 'helsinkiAdditionalPanelSchema' : 'helsinkiSignSchema'
      }`
    );

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

  const direction = castedFeature.direction;
  const correctedDirection = direction ? oppositeBearing(direction) : direction;

  /**
   * Extracting text and values from txt field.
   */
  const textMatch = castedFeature.txt
    ? castedFeature.txt.match(/text:([^;]*)/)
    : undefined;
  const text = textMatch ? textMatch[1].trim() : undefined;
  const numbers = text ? text.match(/\b[1-9]\d*/) : '';
  const value = parseInt(numbers ? numbers[0] : '');
  const txt = isAdditionalPanel ? text : castedFeature.txt;

  const isValueSign =
    Object.keys(trafficSignRules).includes(finalCode) && trafficSignRules[finalCode].unit;
  const hasValidValue = isValueSign && isAdditionalPanel && !isNaN(value);
  const hasValidNumberValue = isValueSign && !isNaN(numberValue);

  const geoJsonFeature = {
    type: 'Feature',
    id,
    properties: {
      TYPE: isAdditionalPanel
        ? GeoJsonFeatureType.AdditionalPanel
        : GeoJsonFeatureType.TrafficSign,
      ID: id,
      SUUNTIMA: correctedDirection,
      LM_TYYPPI: createTrafficSignText(finalCode),
      ARVO: hasValidValue ? value : hasValidNumberValue ? numberValue : undefined,
      TEKSTI: txt ? txt.substring(0, 128) : txt,
      ...(isAdditionalPanel
        ? {}
        : { LISAKILVET: panels.filter((panel) => panel).slice(0, 5) }),
      KALVON_TYYPPI: castedFeature.reflection_class,
      KUNTO: castedFeature.condition,
      KOKO: castedFeature.size,
      KORKEUS: castedFeature.height
    },
    geometry: {
      type: 'Point',
      coordinates: [...projectedCoordinates, 0]
    }
  };

  if (castedFeature.direction === null || castedFeature.direction === undefined)
    return invalidFeature(geoJsonFeature, 'Missing direction for traffic sign');

  return schema.cast(geoJsonFeature);
};
