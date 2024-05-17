type ApiResponseType = 'gml' | 'xml' | 'json';

const isApiResponseType = (
  responseType: unknown
): responseType is ApiResponseType => {
  return (
    responseType === 'gml' || responseType === 'xml' || responseType === 'json'
  );
};

// Keep in sync isAssetType
interface AssetTypeStrings {
  obstacles?: 'infrao:Rakenne';
  trafficSigns?: 'infrao:Liikennemerkki';
  roadSurfaces?: 'infrao:KatualueenOsa';
}

const isAssetTypeStrings = (
  assetType: unknown
): assetType is AssetTypeStrings => {
  if (typeof assetType !== 'object' || assetType === null) return false;

  const { obstacles, trafficSigns, roadSurfaces } =
    assetType as AssetTypeStrings;

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

export type AssetType =
  ScheduleEvent['assetTypes'][keyof ScheduleEvent['assetTypes']];

// Keep in sync AssetTypeStrings
export const isAssetType = (assetType: unknown): assetType is AssetType => {
  if (typeof assetType !== 'string') return false;

  return [
    'infrao:Rakenne',
    'infrao:Liikennemerkki',
    'infrao:KatualueenOsa'
  ].includes(assetType);
};

/**
 * Scheduled EventBridge trigger event
 */
export interface ScheduleEvent {
  url: string;
  format: ApiResponseType;
  municipality: string;
  assetTypes: AssetTypeStrings;
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
    !isAssetTypeStrings(assetTypes)
  ) {
    return false;
  }

  return true;
};
