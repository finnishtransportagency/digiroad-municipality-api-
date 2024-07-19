import {
  AdditionalPanelType,
  Feature,
  TrafficSignType,
  ValidFeature
} from '@customTypes/featureTypes';
import { getDistance2D, similarBearing } from '@libs/spatial-tools';

/**
 * Goes through all traffic signs and adds additional panels to the main signs LISAKILVET array
 *
 * @param features Array of all traffic signs to be matched
 * @returns Main traffic signs with additional panels added to them
 */
export default (features: Array<Feature>): Array<ValidFeature> => {
  const validFeatures = features.filter((f): f is ValidFeature => f.type === 'Feature');
  const additionalPanels = validFeatures.filter(
    (f): f is AdditionalPanelType => f.properties.TYPE === 'ADDITIONALPANEL'
  );
  const mainPanels = validFeatures.filter(
    (f): f is TrafficSignType => f.properties.TYPE === 'TRAFFICSIGN'
  );
  const rejectedAdditionalPanels: Array<Feature> = [];
  for (const additionalPanel of additionalPanels) {
    let matched = false;
    for (const mainPanel of mainPanels) {
      const distance = getDistance2D(
        additionalPanel.geometry.coordinates,
        mainPanel.geometry.coordinates
      );
      if (
        'SUUNTIMA' in additionalPanel.properties &&
        additionalPanel.properties.SUUNTIMA !== undefined &&
        'SUUNTIMA' in mainPanel.properties &&
        mainPanel.properties.SUUNTIMA !== undefined
      ) {
        if (
          distance <= 2 &&
          similarBearing(
            additionalPanel.properties.SUUNTIMA,
            mainPanel.properties.SUUNTIMA
          )
        ) {
          if (
            'LISAKILVET' in mainPanel.properties &&
            mainPanel.properties.LISAKILVET !== undefined
          ) {
            mainPanel.properties.LISAKILVET.push(additionalPanel.properties);
            matched = true;
            break;
          }
        }
      }
    }
    if (!matched) {
      rejectedAdditionalPanels.push(additionalPanel);
    }
  }

  return mainPanels;
};
