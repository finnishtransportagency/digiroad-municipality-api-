import { invokeLambda, middyfy } from '@libs/lambda-tools';
import { DrKuntaFeature, PayloadFeature } from '@functions/typing';
import {
  obstaclesSchema,
  trafficSignsSchema,
  roadSurfacesSchema
} from './validation/validationSchema';
import { isEqual } from 'lodash';
import {
  deleteFromS3,
  getFromS3,
  listS3Objects,
  uploadToS3
} from '@libs/s3-tools';
import { S3Event } from 'aws-lambda';

const getAndFormatS3Object = async (
  bucketName: string,
  fileName: string
): Promise<unknown> => {
  const data = await getFromS3(bucketName, fileName);
  return JSON.parse(data) as unknown;
};

const calculateDelta = async (event: S3Event) => {
  const key: string = decodeURIComponent(event.Records[0].s3.object.key);

  const municipality: string = key.split('/')[1];
  const assetType: string = key.split('/')[2];

  try {
    var keys = await listS3Objects(
      `dr-kunta-${process.env.STAGE_NAME}-bucket`,
      `geojson/${municipality}/${assetType}/`
    );
    const sortedKeyList = keys.Contents.sort((k) => -k.LastModified.getTime());
    var updateKey = sortedKeyList[0].Key;
    var refrenceKey = sortedKeyList.length > 1 ? sortedKeyList[1].Key : null; //null for first upload where a refrence object does not exist
  } catch (e: unknown) {
    if (!(e instanceof Error)) throw e;
    throw new Error(`Could not list object keys from S3: ${e.message}`);
  }

  let schema;
  if (assetType === 'obstacles') {
    schema = obstaclesSchema;
  }
  if (assetType === 'trafficSigns') {
    schema = trafficSignsSchema;
  }
  if (assetType === 'roadSurfaces') {
    schema = roadSurfacesSchema;
  }
  if (!schema) {
    throw new Error('Unknown assetType');
  }

  try {
    var updateObject = await getAndFormatS3Object(
      `dr-kunta-${process.env.STAGE_NAME}-bucket`,
      updateKey
    );
    const valid = await schema.validate(updateObject);
    if (!valid) {
      throw new Error('Invalid schema');
    }
    updateObject = schema.cast(updateObject);
  } catch (e: unknown) {
    if (!(e instanceof Error)) throw e;
    await invokeLambda(
      `DRKunta-${process.env.STAGE_NAME}-reportRejectedDelta`,
      'Event',
      Buffer.from(
        JSON.stringify({
          ReportType: 'invalidData',
          Municipality: municipality,
          Body: { Message: e.message }
        })
      )
    );
    await deleteFromS3(`dr-kunta-${process.env.STAGE_NAME}-bucket`, updateKey);
    throw new Error(`Object deleted because of invalid data: ${e.message}`);
  }

  let referenceObject =
    refrenceKey === null
      ? { type: 'FeatureCollection', features: [] }
      : await getAndFormatS3Object(
          `dr-kunta-${process.env.STAGE_NAME}-bucket`,
          refrenceKey
        );

  referenceObject = schema.cast(referenceObject);

  const updateFeatures: Array<DrKuntaFeature> = updateObject.features;
  const referenceFeatures: Array<DrKuntaFeature> = referenceObject.features;

  let created: Array<DrKuntaFeature> = [];
  const updated: Array<DrKuntaFeature> = [];
  let deleted: Array<DrKuntaFeature> = [];

  // returns true if Features differ
  function compareFeatures(obj1: DrKuntaFeature, obj2: DrKuntaFeature) {
    return !isEqual(obj1, obj2);
  }
  if (assetType === 'obstacles' || assetType === 'trafficSigns') {
    for (let i = 0; i < updateFeatures.length; i++) {
      let found = false;
      for (let j = 0; j < referenceFeatures.length; j++) {
        if (
          updateFeatures[i].properties.ID ===
            referenceFeatures[j].properties.ID &&
          updateFeatures[i].properties.TYPE ===
            referenceFeatures[j].properties.TYPE
        ) {
          if (compareFeatures(updateFeatures[i], referenceFeatures[j])) {
            updated.push(updateFeatures[i]);
          }
          found = true;
          break;
        }
      }
      if (!found) {
        created.push(updateFeatures[i]);
      }
    }
    for (let j = 0; j < referenceFeatures.length; j++) {
      let found = false;
      for (let i = 0; i < updateFeatures.length; i++) {
        if (
          updateFeatures[i].properties.ID ===
            referenceFeatures[j].properties.ID &&
          updateFeatures[i].properties.TYPE ===
            referenceFeatures[j].properties.TYPE
        ) {
          found = true;
          break;
        }
      }
      if (!found) {
        deleted.push(referenceFeatures[j]);
      }
    }
  }
  if (assetType === 'roadSurfaces') {
    if (!isEqual(updateFeatures, referenceFeatures)) {
      created = updateFeatures;
      deleted = referenceFeatures;
    }
  }
  const payLoad: PayloadFeature = {
    Created: created,
    Deleted: deleted,
    Updated: updated,
    metadata: {
      municipality: municipality,
      assetType: assetType
    },
    invalidInfrao: updateObject.invalidInfrao
  };

  const now = new Date().toISOString().slice(0, 19);

  await uploadToS3(
    `dr-kunta-${process.env.STAGE_NAME}-bucket`,
    `calculateDelta/${municipality}/${now}.json`,
    JSON.stringify(payLoad)
  );

  await invokeLambda(
    `DRKunta-${process.env.STAGE_NAME}-matchRoadLink`,
    'Event',
    Buffer.from(
      JSON.stringify({ key: `calculateDelta/${municipality}/${now}.json` })
    )
  );
};

export const main = middyfy(calculateDelta);
