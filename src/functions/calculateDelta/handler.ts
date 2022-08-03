import { middyfy } from '@libs/lambda';
import * as aws from 'aws-sdk';
import { ObstacleFeature, PayloadFeature } from '@functions/typing';
import { schema } from './validationSchema';

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
    var refrenceKey = sortedKeyList[1].Key;
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
  } catch (e) {
    await lambda
      .invoke({
        FunctionName: `digiroad-municipality-api-${process.env.STAGE_NAME}-reportRejectedDelta`,
        InvocationType: 'Event',
        Payload: JSON.stringify({
          ReportSource: 'calculateDelta',
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

  const referenceObject = JSON.parse(
    await getObject(`dr-kunta-${process.env.STAGE_NAME}-bucket`, refrenceKey)
  );

  const updateFeatures: Array<ObstacleFeature> = updateObject.features;
  const referenceFeatures: Array<ObstacleFeature> = referenceObject.features;

  const created: Array<ObstacleFeature> = [];
  const deleted: Array<ObstacleFeature> = [];
  const updated: Array<ObstacleFeature> = [];

  function comparePoints(obj1: ObstacleFeature, obj2: ObstacleFeature) {
    if (obj1.properties.EST_TYYPPI !== obj2.properties.EST_TYYPPI) {
      return true;
    }
    if (
      obj1.geometry.coordinates[0] !== obj2.geometry.coordinates[0] ||
      obj1.geometry.coordinates[1] !== obj2.geometry.coordinates[1]
    ) {
      return true;
    }
    return false;
  }

  for (let i = 0; i < updateFeatures.length; i++) {
    let found = false;
    for (let j = 0; j < referenceFeatures.length; j++) {
      if (
        updateFeatures[i].properties.ID === referenceFeatures[j].properties.ID
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
        updateFeatures[i].properties.ID === referenceFeatures[j].properties.ID
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
    FunctionName: `digiroad-municipality-api-${process.env.STAGE_NAME}-matchRoadLink`,
    InvocationType: 'Event',
    Payload: JSON.stringify(payLoad)
  };
  await lambda.invoke(param).promise();
};
export const main = middyfy(calculateDelta);
