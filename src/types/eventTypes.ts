import { ValidFeature } from './featureTypes';

type ApiResponseType = 'gml' | 'xml' | 'json';
const isApiResponseType = (responseType: unknown): responseType is ApiResponseType => {
  return responseType === 'gml' || responseType === 'xml' || responseType === 'json';
};

/**
 * Scheduled EventBridge trigger event
 */
export interface ScheduleEvent {
  url: string;
  format: ApiResponseType;
  municipality: string;
  assetTypes: AssetTypes;
}
export const isScheduleEvent = (event: unknown): event is ScheduleEvent => {
  if (typeof event !== 'object' || event === null) return false;

  const { url, format, municipality, assetTypes } = event as ScheduleEvent;

  if (
    typeof url !== 'string' ||
    !isApiResponseType(format) ||
    typeof municipality !== 'string' ||
    assetTypes === null ||
    typeof assetTypes !== 'object' ||
    !isAssetTypes(assetTypes)
  ) {
    return false;
  }

  return true;
};

/**
 * Update payload saved to S3
 */
export interface UpdatePayload {
  Created: Array<ValidFeature>;
  Updated: Array<ValidFeature>;
  Deleted: Array<ValidFeature>;
  metadata: {
    municipality: string;
    assetType: AssetTypeKey;
  };
  invalidInfrao: {
    sum: number;
    IDs: Array<number>;
  };
}

// Keep in sync with isAssetTypeKey & isAssetTypeString
interface AssetTypes {
  obstacles?: 'infrao:Rakenne';
  trafficSigns?: 'infrao:Liikennemerkki';
  roadSurfaces?: 'infrao:KatualueenOsa';
}
const isAssetTypes = (assetType: unknown): assetType is AssetTypes => {
  if (!assetType || typeof assetType !== 'object') return false;

  const { obstacles, trafficSigns, roadSurfaces } = assetType as AssetTypes;

  if (
    (!obstacles && !trafficSigns && !roadSurfaces) ||
    (obstacles && obstacles !== 'infrao:Rakenne') ||
    (trafficSigns && trafficSigns !== 'infrao:Liikennemerkki') ||
    (roadSurfaces && roadSurfaces !== 'infrao:KatualueenOsa')
  ) {
    return false;
  }

  return true;
};

/**
 * 'obstacles' | 'trafficSigns' | 'roadSurfaces'
 */
export type AssetTypeKey = keyof AssetTypes;
// Keep in sync AssetTypes
export const isAssetTypeKey = (assetType: unknown): assetType is AssetTypeKey => {
  if (typeof assetType !== 'string') return false;

  return ['obstacles', 'trafficSigns', 'roadSurfaces'].includes(assetType);
};

/**
 * 'infrao:Rakenne' | 'infrao:Liikennemerkki' | 'infrao:KatualueenOsa'
 */
export type AssetTypeString =
  ScheduleEvent['assetTypes'][keyof ScheduleEvent['assetTypes']];
// Keep in sync AssetTypes
export const isAssetTypeString = (assetType: unknown): assetType is AssetTypeString => {
  if (typeof assetType !== 'string') return false;

  return ['infrao:Rakenne', 'infrao:Liikennemerkki', 'infrao:KatualueenOsa'].includes(
    assetType
  );
};
