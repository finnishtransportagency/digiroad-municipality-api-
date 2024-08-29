import { AssetTypeString } from '@customTypes/eventTypes';
import { Feature } from '@customTypes/featureTypes';
import obstacleParser from './obstacleParser';
import trafficSignParser from './trafficSignParser';

export default (assetType: AssetTypeString, feature: unknown): Feature => {
  try {
    switch (assetType) {
      case 'infrao:Rakenne':
        return obstacleParser(feature);

      case 'infrao:Liikennemerkki':
        return trafficSignParser(feature);

      case 'infrao:KatualueenOsa':
        //TODO: Implement surfaceParser
        console.warn(`${assetType} not yet implemented in parseFeature`);
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
      id: -1,
      properties: {
        reason: e.message,
        feature: JSON.stringify(feature)
      }
    };
  }
  return {
    type: 'Invalid',
    id: -1,
    properties: {
      reason: `Asset type not supported by parseFeature: ${assetType ?? 'undefined'}`,
      feature: JSON.stringify(feature)
    }
  };
};
