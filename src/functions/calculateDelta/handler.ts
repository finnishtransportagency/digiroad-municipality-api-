import { invokeLambda, middyfy } from '@libs/lambda-tools';
import { isEqual } from 'lodash';
import { deleteFromS3, getFromS3, listS3Objects, uploadToS3 } from '@libs/s3-tools';
import { S3Event } from 'aws-lambda';
import { bucketName } from '@functions/config';
import {
  AssetTypeKey,
  isAssetTypeKey,
  isSupportedMunicipality,
  UpdatePayload
} from '@customTypes/eventTypes';
import {
  geoJsonSchema,
  obstacleFeatureSchema,
  trafficSignFeatureSchema
} from '@schemas/geoJsonSchema';
import { FeatureCollection, ValidFeature } from '@customTypes/featureTypes';

enum FeatureObjectType {
  UPDATE = 0,
  REFERENCE = 1
}

interface FeatureCollectionResult {
  error: string | null;
  object: FeatureCollection | null;
}

const calculateDelta = async (event: S3Event) => {
  /**
   * @example geojson/espoo/obstacles/2024-07-11T13:55:21.json
   */
  const updateObjectKey: string = event.Records[0].s3.object.key;
  const municipality = updateObjectKey.split('/')[1];
  if (!isSupportedMunicipality(municipality)) throw new Error('Invalid municipality');
  const assetType: string = updateObjectKey.split('/')[2];
  if (!isAssetTypeKey(assetType)) throw new Error('Invalid assetType');

  const updateCollectionResult: FeatureCollectionResult = await getFeatureCollection(
    municipality,
    assetType,
    FeatureObjectType.UPDATE
  );
  if (!updateCollectionResult.object) {
    await reportUpdateObjectError(
      updateCollectionResult.error || 'Unknown error',
      updateObjectKey
    );
    throw new Error(`Error while retrieving update object: ${updateObjectKey}`);
  }
  const updateObject: FeatureCollection = updateCollectionResult.object;
  const referenceObject: FeatureCollection | null = (
    await getFeatureCollection(municipality, assetType, FeatureObjectType.REFERENCE)
  ).object;

  const updateFeatures: Array<ValidFeature> = updateObject.features.filter((f) =>
    validateFeatureAssetType(f, assetType)
  );
  const referenceFeatures: Array<ValidFeature> = referenceObject
    ? referenceObject.features.filter((f) => validateFeatureAssetType(f, assetType))
    : [];
  const referencesExist: boolean = referenceFeatures.length > 0;

  const updatePayload: UpdatePayload = {
    Created: referencesExist ? [] : updateFeatures,
    Updated: [],
    Deleted: [],
    metadata: {
      municipality,
      assetType
    },
    invalidInfrao: updateObject.invalidInfrao
  };
  if (referencesExist)
    pushUpdatesToPayload(updatePayload, updateFeatures, referenceFeatures);

  const fileName = updateObjectKey.split('/')[3].split('.')[0];
  await uploadToS3(
    bucketName,
    `calculateDelta/${municipality}/${fileName}.json`,
    JSON.stringify(updatePayload)
  );
  // No need to await for matchRoadLink
  void invokeLambda(
    'matchRoadLink',
    'Event',
    Buffer.from(
      JSON.stringify({ key: `calculateDelta/${municipality}/${fileName}.json` })
    )
  );
};

const getFeatureCollection = async (
  municipality: string,
  assetType: AssetTypeKey,
  index: FeatureObjectType
): Promise<FeatureCollectionResult> => {
  try {
    const { Contents } = await listS3Objects(
      bucketName,
      `geojson/${municipality}/${assetType}/`
    );

    if (!Contents || Contents.length < index + 1)
      return {
        error: `Less than ${
          index + 1
        } object(s) found in geojson/${municipality}/${assetType}/`,
        object: null
      };
    const foundObject = Contents.sort((object) =>
      object && object.LastModified ? -object.LastModified.getTime() : 0
    )[index];

    if (!foundObject || !foundObject.Key)
      return { error: `No object found in index: ${index}`, object: null };

    return {
      error: null,
      object: geoJsonSchema.cast(JSON.parse(await getFromS3(bucketName, foundObject.Key)))
    };
  } catch (e: unknown) {
    if (!(e instanceof Error)) throw e;
    console.error(`Could not get FeatureCollection: ${e.message}`);
    return { error: e.message, object: null };
  }
};

const reportUpdateObjectError = async (error: string, updateObjectKey: string) => {
  await deleteFromS3(bucketName, updateObjectKey);
  console.error(`${updateObjectKey} deleted because of invalid data: ${error}`);
};

const validateFeatureAssetType = (
  feature: ValidFeature,
  assetType: AssetTypeKey
): boolean => {
  switch (assetType) {
    case 'obstacles':
      return obstacleFeatureSchema.isValidSync(feature);
    case 'trafficSigns':
      return trafficSignFeatureSchema.isValidSync(feature);
    default:
      return false;
  }
};

const pushUpdatesToPayload = (
  payloadObject: UpdatePayload,
  updateFeatures: Array<ValidFeature>,
  referenceFeatures: Array<ValidFeature>
) => {
  updateFeatures.forEach((updateFeature) => {
    const referenceFeature: ValidFeature | undefined = referenceFeatures.find(
      (f) =>
        f.properties.ID === updateFeature.properties.ID &&
        f.properties.TYPE === updateFeature.properties.TYPE
    );

    if (referenceFeature) {
      if (!isEqual(updateFeature, referenceFeature))
        payloadObject.Updated.push(updateFeature);
    } else {
      payloadObject.Created.push(updateFeature);
    }
  });

  referenceFeatures.forEach((referenceFeature) => {
    if (!updateFeatures.find((f) => isEqual(f, referenceFeature)))
      payloadObject.Deleted.push(referenceFeature);
  });
};

export const main = middyfy(calculateDelta);
