import { InferType } from 'yup';
import { MatchedFeature, ValidFeature } from './featureTypes';
import { updatePayloadSchema } from '@schemas/updatePayloadSchema';
import { gnlPayloadSchema } from '@schemas/getNearbyLinksSchema';
import { supportedMunicipalities } from '@functions/config';

type SupportedMunicipality = (typeof supportedMunicipalities)[number];
export const isSupportedMunicipality = (
  municipality: string
): municipality is SupportedMunicipality =>
  supportedMunicipalities.includes(municipality as SupportedMunicipality);

type ApiResponseType = 'gml' | 'xml' | 'json' | 'helsinki';
const isApiResponseType = (responseType: unknown): responseType is ApiResponseType => {
  return (
    responseType === 'gml' ||
    responseType === 'xml' ||
    responseType === 'json' ||
    responseType === 'helsinki'
  );
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
export type UpdatePayload = Pick<
  InferType<typeof updatePayloadSchema>,
  'metadata' | 'invalidInfrao'
> & {
  Created: Array<ValidFeature>;
  Updated: Array<ValidFeature>;
  Deleted: Array<ValidFeature>;
};
export const isUpdatePayload = (payload: unknown): payload is UpdatePayload => {
  return updatePayloadSchema.isValidSync(payload);
};

/**
 * Payload saved to S3 by calculateDelta
 */
export type MatchedPayload = Pick<
  InferType<typeof updatePayloadSchema>,
  'metadata' | 'invalidInfrao'
> & {
  Created: Array<MatchedFeature>;
  Updated: Array<MatchedFeature>;
  Deleted: Array<MatchedFeature>;
};
export const isMatchedPayload = (payload: unknown): payload is MatchedPayload => {
  return updatePayloadSchema.isValidSync(payload);
};

// Keep in sync with isAssetTypeKey & isAssetTypeString
/**
 * {
 *   obstacles?: 'infrao:Rakenne';
 *   trafficSigns?: 'infrao:Liikennemerkki';
 * }
 */
interface AssetTypes {
  obstacles?: 'infrao:Rakenne';
  trafficSigns?: 'infrao:Liikennemerkki' | 'traffic-sign-reals';
}
const isAssetTypes = (assetType: unknown): assetType is AssetTypes => {
  if (!assetType || typeof assetType !== 'object') return false;

  const { obstacles, trafficSigns } = assetType as AssetTypes;

  if (
    (!obstacles && !trafficSigns) ||
    (obstacles && obstacles !== 'infrao:Rakenne') ||
    (trafficSigns &&
      trafficSigns !== 'infrao:Liikennemerkki' &&
      trafficSigns !== 'traffic-sign-reals')
  ) {
    return false;
  }

  return true;
};

/**
 * 'obstacles' | 'trafficSigns'
 */
export type AssetTypeKey = keyof AssetTypes;
// Keep in sync AssetTypes
export const isAssetTypeKey = (assetType: unknown): assetType is AssetTypeKey => {
  if (typeof assetType !== 'string') return false;

  return ['obstacles', 'trafficSigns'].includes(assetType);
};

/**
 * 'infrao:Rakenne' | 'infrao:Liikennemerkki' | 'infrao:KatualueenOsa'
 */
export type AssetTypeString =
  ScheduleEvent['assetTypes'][keyof ScheduleEvent['assetTypes']];
// Keep in sync AssetTypes
export const isAssetTypeString = (assetType: unknown): assetType is AssetTypeString => {
  if (typeof assetType !== 'string') return false;

  return [
    'infrao:Rakenne',
    'infrao:Liikennemerkki',
    'infrao:KatualueenOsa',
    'traffic-sign-reals'
  ].includes(assetType);
};

/**
 * Lambda invocation event containing the S3 key of the payload
 */
export interface S3KeyObject {
  key: string;
}
export const isS3KeyObject = (s3KeyObject: unknown): s3KeyObject is S3KeyObject => {
  if (!s3KeyObject || typeof s3KeyObject !== 'object') {
    return false;
  }

  const { key } = s3KeyObject as S3KeyObject;

  if (typeof key !== 'string') {
    return false;
  }

  return true;
};

export type GetNearbyLinksPayload = Omit<
  InferType<typeof gnlPayloadSchema>,
  'features'
> & {
  features: Array<ValidFeature>;
};
export const isGetNearbyLinksPayload = (
  payload: unknown
): payload is GetNearbyLinksPayload => {
  return gnlPayloadSchema.isValidSync(payload);
};
