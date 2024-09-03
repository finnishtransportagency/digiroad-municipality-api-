import {
  DrKuntaFeature,
  LinkObject,
  isDrKuntaFeature,
  isLinkObject
} from '@functions/typing';

type AssetType = 'obstacles' | 'trafficSigns';

const isAssetType = (assetType: unknown): assetType is AssetType => {
  return assetType === 'obstacles' || assetType === 'trafficSigns';
};

interface Delta {
  Created: Array<DrKuntaFeature>;
  Deleted: Array<DrKuntaFeature>;
  Updated: Array<DrKuntaFeature>;
  metadata: {
    municipality: 'espoo';
    assetType: AssetType;
  };
  invalidInfrao: { sum: number; IDs: Array<number> };
}

export const isDelta = (delta: unknown): delta is Delta => {
  if (typeof delta !== 'object' || delta === null) {
    return false;
  }

  const { Created, Deleted, Updated, metadata, invalidInfrao } = delta as Delta;

  if (
    !Array.isArray(Created) ||
    !Created.every((feature) => isDrKuntaFeature(feature)) ||
    !Array.isArray(Deleted) ||
    !Deleted.every((feature) => isDrKuntaFeature(feature)) ||
    !Array.isArray(Updated) ||
    !Updated.every((feature) => isDrKuntaFeature(feature)) ||
    typeof metadata !== 'object' ||
    metadata === null ||
    typeof metadata.municipality !== 'string' ||
    !isAssetType(metadata.assetType) ||
    typeof invalidInfrao !== 'object' ||
    invalidInfrao === null ||
    typeof invalidInfrao.sum !== 'number' ||
    !Array.isArray(invalidInfrao.IDs)
  ) {
    return false;
  }

  return true;
};

export interface FeatureRoadlinkMap {
  id: string;
  type: string;
  roadlinks: Array<LinkObject>;
}

export const isFeatureRoadlinkMap = (
  featureRoadlinkMap: unknown
): featureRoadlinkMap is FeatureRoadlinkMap => {
  if (typeof featureRoadlinkMap !== 'object' || featureRoadlinkMap === null) {
    return false;
  }

  const { id, type, roadlinks } = featureRoadlinkMap as FeatureRoadlinkMap;

  if (
    typeof id !== 'string' ||
    typeof type !== 'string' ||
    !Array.isArray(roadlinks) ||
    !roadlinks.every((roadlink) => isLinkObject(roadlink))
  ) {
    return false;
  }

  return true;
};
