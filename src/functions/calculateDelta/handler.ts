import { middyfy } from '@libs/lambda';
import { Lambda, InvokeCommand } from '@aws-sdk/client-lambda';
import {
  S3,
  ListObjectsV2Command,
  GetObjectCommand,
  DeleteObjectCommand
} from '@aws-sdk/client-s3';
import { Feature, PayloadFeature } from '@functions/typing';
import { schema } from './validation/validationSchema';
import isEqual from 'lodash.isequal';

const calculateDelta = async (event) => {
  const s3 = new S3({});
  const lambda = new Lambda({});
  const key: string = decodeURIComponent(event.Records[0].s3.object.key);

  const municipality: string = key.split('/')[1];

  try {
    const listObjectsparams = {
      Bucket: `dr-kunta-${process.env.STAGE_NAME}-bucket`,
      Prefix: `geojson/${municipality}`
    };
    const listObjectsCommand = new ListObjectsV2Command(listObjectsparams);
    var keys = await s3.send(listObjectsCommand);
    const sortedKeyList = keys.Contents.sort((k) => -k.LastModified.getTime());
    var updateKey = sortedKeyList[0].Key;
    var refrenceKey = sortedKeyList.length > 1 ? sortedKeyList[1].Key : null; //null for first upload where a refrence object does not exist
  } catch (e) {
    throw new Error(`Could not list object keys from S3: ${e.message}`);
  }

  async function getObject(bucket: string, objectKey: string) {
    try {
      const getObjectParams = {
        Bucket: bucket,
        Key: objectKey
      };
      const getObjectsCommand = new GetObjectCommand(getObjectParams);
      const data = await s3.send(getObjectsCommand);
      const object = await data.Body.transformToString();
      return JSON.parse(object);
    } catch (e) {
      throw new Error(`Could not retrieve file from S3: ${e.message}`);
    }
  }

  try {
    var updateObject = await getObject(
      `dr-kunta-${process.env.STAGE_NAME}-bucket`,
      updateKey
    );
    const valid = await schema.validate(updateObject);
    if (!valid) {
      throw new Error('Invalid schema');
    }
    updateObject = schema.cast(updateObject);
  } catch (e) {
    const invokeRejectedDeltaParams = {
      FunctionName: `DRKunta-${process.env.STAGE_NAME}-reportRejectedDelta`,
      InvocationType: 'Event',
      Payload: Buffer.from(
        JSON.stringify({
          ReportType: 'invalidData',
          Municipality: municipality,
          Body: { Message: e.message }
        })
      )
    };
    const invokeRejectedDeltaCommand = new InvokeCommand(
      invokeRejectedDeltaParams
    );
    await lambda.send(invokeRejectedDeltaCommand);
    const deleteObjectParams = {
      Bucket: `dr-kunta-${process.env.STAGE_NAME}-bucket`,
      Key: updateKey
    };

    const deleteObjectCommand = new DeleteObjectCommand(deleteObjectParams);

    await s3.send(deleteObjectCommand);
    throw new Error(`Object deleted because of invalid data: ${e.message}`);
  }

  let referenceObject =
    refrenceKey === null
      ? { type: 'FeatureCollection', features: [] }
      : await getObject(
          `dr-kunta-${process.env.STAGE_NAME}-bucket`,
          refrenceKey
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
        updateFeatures[i].properties.TYPE ===
          referenceFeatures[j].properties.TYPE
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
  const invokeMatchRoadLinkParams = {
    FunctionName: `DRKunta-${process.env.STAGE_NAME}-matchRoadLink`,
    InvocationType: 'Event',
    Payload: Buffer.from(JSON.stringify(payLoad))
  };
  const invokeMatchRoadLinksCommand = new InvokeCommand(
    invokeMatchRoadLinkParams
  );
  await lambda.send(invokeMatchRoadLinksCommand);
};
export const main = middyfy(calculateDelta);
