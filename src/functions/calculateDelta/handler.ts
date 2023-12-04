import { middyfy } from '@libs/lambda';
import { Lambda, InvokeCommand } from '@aws-sdk/client-lambda';
import {
  S3,
  ListObjectsV2Command,
  GetObjectCommand,
  DeleteObjectCommand
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { DrKuntaFeature, PayloadFeature } from '@functions/typing';
import {
  obstaclesSchema,
  trafficSignsSchema,
  roadSurfacesSchema
} from './validation/validationSchema';
import isEqual from 'lodash.isequal';
import { offline } from '@functions/config';

const calculateDelta = async (event) => {
  const s3config = offline
    ? {
        forcePathStyle: true,
        credentials: {
          accessKeyId: 'S3RVER', // This specific key is required when working offline
          secretAccessKey: 'S3RVER'
        },
        endpoint: 'http://localhost:4569'
      }
    : {};
  const s3 = new S3(s3config);
  const lambda = new Lambda({});
  const key: string = decodeURIComponent(event.Records[0].s3.object.key);

  const municipality: string = key.split('/')[1];
  const assetType: string = key.split('/')[2];

  try {
    const listObjectsparams = {
      Bucket: `dr-kunta-${process.env.STAGE_NAME}-bucket`,
      Prefix: `geojson/${municipality}/${assetType}/`
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
  const putParams = {
    Bucket: `dr-kunta-${process.env.STAGE_NAME}-bucket`,
    Key: `calculateDelta/${municipality}/${now}.json`,
    Body: JSON.stringify(payLoad)
  };

  await new Upload({
    client: s3,
    params: putParams
  }).done();

  const invokeMatchRoadLinkParams = {
    FunctionName: `DRKunta-${process.env.STAGE_NAME}-matchRoadLink`,
    InvocationType: 'Event',
    Payload: Buffer.from(
      JSON.stringify({ key: `calculateDelta/${municipality}/${now}.json` })
    )
  };
  const invokeMatchRoadLinksCommand = new InvokeCommand(
    invokeMatchRoadLinkParams
  );
  await lambda.send(invokeMatchRoadLinksCommand);
};
export const main = middyfy(calculateDelta);
