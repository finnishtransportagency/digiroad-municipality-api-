import { AssetTypeString } from '@customTypes/eventTypes';
import { Feature } from '@customTypes/featureTypes';
import obstacleParser from './obstacleParser';
import trafficSignParser from './trafficSignParser';
import { SignMap } from '@customTypes/mapTypes';
import helsinkiSignParser from './helsinki/helsinkiSignParser';

export default (
  assetType: AssetTypeString,
  feature: unknown,
  signMap?: Array<SignMap>
): Feature => {
  try {
    switch (assetType) {
      case 'infrao:Rakenne':
        return obstacleParser(feature);

      case 'infrao:Liikennemerkki':
        return trafficSignParser(feature);

      case 'traffic-sign-reals':
        if (signMap) return helsinkiSignParser(feature, signMap, false);
        console.warn('Could not fetch singMap');
        break;

      default:
        console.warn('Asset type not supported by parseFeature:', assetType);
    }
  } catch (e: unknown) {
    if (!(e instanceof Error)) throw e;
    console.error('Error in parseFeature:', e.message);
    console.info('Invalid feature:', feature);
    return {
      type: 'Invalid',
      id: '-1',
      properties: {
        reason: e.message,
        feature: JSON.stringify(feature)
      }
    };
  }
  return {
    type: 'Invalid',
    id: '-1',
    properties: {
      reason: `Asset type not supported by parseFeature: ${assetType ?? 'undefined'}`,
      feature: JSON.stringify(feature)
    }
  };
};
