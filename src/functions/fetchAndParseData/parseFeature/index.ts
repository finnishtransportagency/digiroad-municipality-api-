import { AssetTypeString } from '@customTypes/eventTypes';
import { AdditionalPanelParseObject, Feature } from '@customTypes/featureTypes';
import obstacleParser from './obstacleParser';
import trafficSignParser from './trafficSignParser';
import { SignMap } from '@customTypes/mapTypes';
import helsinkiSignParser from './helsinki/helsinkiSignParser';
import { invalidFeature } from '@libs/schema-tools';

export default (
  assetType: AssetTypeString,
  feature: unknown,
  signMap?: Array<SignMap>,
  additionalPanels?: AdditionalPanelParseObject['additionalPanels']
): Feature => {
  try {
    switch (assetType) {
      case 'infrao:Rakenne':
        return obstacleParser(feature);

      case 'infrao:Liikennemerkki':
        return trafficSignParser(feature);

      case 'traffic-sign-reals':
        if (signMap) return helsinkiSignParser(feature, signMap, false, additionalPanels);
        console.warn('Could not fetch singMap');
        break;

      default:
        console.warn('Asset type not supported by parseFeature:', assetType);
    }
  } catch (e: unknown) {
    if (!(e instanceof Error)) throw e;
    //console.error('Error in parseFeature:', e.message);
    //console.info('Invalid feature:', feature);
    return invalidFeature(feature, e.message);
  }
  return invalidFeature(
    feature,
    `Asset type not supported by parseFeature: ${assetType ?? 'undefined'}`
  );
};
