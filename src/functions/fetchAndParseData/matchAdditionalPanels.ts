import {
  AdditionalPanelType,
  Feature,
  TrafficSignType,
  ValidFeature
} from '@customTypes/featureTypes';
import { getDistance2D, similarBearing } from '@libs/spatial-tools';
import { additionalPanelFeatureSchema, GeoJsonFeatureType } from '@schemas/geoJsonSchema';

/**
 * Goes through all traffic signs and adds additional panels to the main signs LISAKILVET array
 *
 * @param features Array of all traffic signs to be matched
 * @returns Main traffic signs with additional panels added to them
 */
export default (features: Array<Feature | AdditionalPanelType>): Array<ValidFeature> => {
  const validFeatures = features.filter(
    (f): f is ValidFeature | AdditionalPanelType => f.type === 'Feature'
  );
  const additionalPanels = validFeatures.filter(
    (f): f is AdditionalPanelType =>
      f.properties.TYPE === GeoJsonFeatureType.AdditionalPanel
  );

  const validAdditionalPanels = additionalPanels.filter((f) =>
    additionalPanelFeatureSchema.isValidSync(f)
  );
  const mainPanels = validFeatures.filter(
    (f): f is TrafficSignType => f.properties.TYPE === GeoJsonFeatureType.TrafficSign
  );
  const rejectedAdditionalPanels: Array<AdditionalPanelType> = [];
  for (const additionalPanel of validAdditionalPanels) {
    let matched = false;
    for (const mainPanel of mainPanels) {
      if (mainPanel.properties.LISAKILVET.length >= 5) continue;
      const distance = getDistance2D(
        additionalPanel.geometry.coordinates,
        mainPanel.geometry.coordinates
      );
      if (
        distance <= 2 &&
        additionalPanel.properties.SUUNTIMA !== null &&
        additionalPanel.properties.SUUNTIMA !== undefined &&
        similarBearing(additionalPanel.properties.SUUNTIMA, mainPanel.properties.SUUNTIMA)
      ) {
        mainPanel.properties.LISAKILVET.push(additionalPanel.properties);
        matched = true;
        break;
      }
    }
    if (!matched) {
      rejectedAdditionalPanels.push(additionalPanel);
    }
  }

  return mainPanels;
};
