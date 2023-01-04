import { middyfy } from '@libs/lambda';
import * as aws from 'aws-sdk';
import { Feature, PayloadFeature } from '@functions/typing';
import { schema } from './validationSchema';
import isEqual from 'lodash.isequal';

const calculateDelta = async (event) => {
  const s3 = new aws.S3();
  const lambda = new aws.Lambda();
  const key: string = decodeURIComponent(event.Records[0].s3.object.key);

  const municipality: string = key.split('/')[1];

  try {
    const params = {
      Bucket: `dr-kunta-${process.env.STAGE_NAME}-bucket`,
      Prefix: `update/${municipality}`
    };

    var keys = await s3.listObjectsV2(params).promise();
    const sortedKeyList = keys.Contents.sort((k) => -k.LastModified.getTime());
    var updateKey = sortedKeyList[0].Key;
    var refrenceKey = sortedKeyList.length > 1 ? sortedKeyList[1].Key : null; //null for first upload where a refrence object does not exist
  } catch (e) {
    throw new Error(`Could not list object keys from S3: ${e.message}`);
  }

  async function getObject(bucket: string, objectKey: string) {
    try {
      const params = {
        Bucket: bucket,
        Key: objectKey
      };

      const data = await s3.getObject(params).promise();

      return data.Body.toString('utf-8');
    } catch (e) {
      throw new Error(`Could not retrieve file from S3: ${e.message}`);
    }
  }

  try {
    var updateObject = JSON.parse(
      await getObject(`dr-kunta-${process.env.STAGE_NAME}-bucket`, updateKey)
    );
    const valid = await schema.validate(updateObject);
    if (!valid) {
      throw new Error('Invalid schema');
    }
    updateObject = schema.cast(updateObject);
  } catch (e) {
    await lambda
      .invoke({
        FunctionName: `DRKunta-${process.env.STAGE_NAME}-reportRejectedDelta`,
        InvocationType: 'Event',
        Payload: JSON.stringify({
          ReportType: 'calculateDelta',
          Municipality: municipality,
          Body: { Message: e.message }
        })
      })
      .promise();
    const params = {
      Bucket: `dr-kunta-${process.env.STAGE_NAME}-bucket`,
      Key: updateKey
    };
    await s3.deleteObject(params).promise();
    throw new Error(`Object deleted because of invalid data: ${e.message}`);
  }

  let referenceObject =
    refrenceKey === null
      ? { type: 'FeatureCollection', features: [] }
      : JSON.parse(
          await getObject(
            `dr-kunta-${process.env.STAGE_NAME}-bucket`,
            refrenceKey
          )
        );

  referenceObject = schema.cast(referenceObject);

  const updateFeatures: Array<Feature> = updateObject.features;
  const referenceFeatures: Array<Feature> = referenceObject.features;

  const created: Array<Feature> = [];
  const deleted: Array<Feature> = [];
  const updated: Array<Feature> = [];

  // returns true if Features differ
  function comparePoints(obj1: Feature, obj2: Feature) {
    return !isEqual(obj1, obj2);
  }

  for (let i = 0; i < updateFeatures.length; i++) {
    let found = false;
    for (let j = 0; j < referenceFeatures.length; j++) {
      if (
        updateFeatures[i].properties.ID ===
          referenceFeatures[j].properties.ID &&
        updateFeatures[i].properties.type ===
          referenceFeatures[j].properties.type
      ) {
        if (comparePoints(updateFeatures[i], referenceFeatures[j])) {
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
        updateFeatures[i].properties.type ===
          referenceFeatures[j].properties.type
      ) {
        found = true;
        break;
      }
    }
    if (!found) {
      deleted.push(referenceFeatures[j]);
    }
  }
  console.log(`Created: ${JSON.stringify(created)}`);
  console.log(`Deleted: ${JSON.stringify(deleted)}`);
  console.log(`Updated: ${JSON.stringify(updated)}`);

  const payLoad: PayloadFeature = {
    Created: created,
    Deleted: deleted,
    Updated: updated,
    metadata: {
      municipality: municipality
    }
  };
  const param = {
    FunctionName: `DRKunta-${process.env.STAGE_NAME}-matchRoadLink`,
    InvocationType: 'Event',
    Payload: JSON.stringify(payLoad)
  };
  await lambda.invoke(param).promise();
};
export const main = middyfy(calculateDelta);
