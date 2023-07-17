import { middyfy } from '@libs/lambda';
import { Lambda, InvokeCommand } from '@aws-sdk/client-lambda';
import { S3, GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import matchTrafficSign from './trafficSigns/matchTrafficSign';
import matchObstacle from './obstacles/matchObstacle';
import GeometryFactory from 'jsts/org/locationtech/jts/geom/GeometryFactory';
import PrecisionModel from 'jsts/org/locationtech/jts/geom/PrecisionModel';

import {
  PayloadFeature,
  Feature,
  LinkObject,
  FeatureRoadlinkMap
} from '@functions/typing';

// Max offset permitted from middle of linestring
const MAX_OFFSET = 2;

const lambda = new Lambda({});
const s3 = new S3({});

const matchRoadLinks = async (event) => {
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

  const delta = await getObject(
    `dr-kunta-${process.env.STAGE_NAME}-bucket`,
    event.key
  );

  let rejectsAmount = 0;

  const features: Array<Feature> = delta.Created.concat(delta.Updated);
  const geomFactory = new GeometryFactory(new PrecisionModel(), 3067);

  const getNearbyLinksPayload = {
    features: features,
    municipality: delta.metadata.municipality,
    assetType: delta.metadata.assetType
  };
  const getNearbyLinksParams = {
    FunctionName: `DRKunta-${process.env.STAGE_NAME}-getNearbyLinks`,
    InvocationType: 'RequestResponse',
    Payload: Buffer.from(JSON.stringify(getNearbyLinksPayload))
  };

  const getNearbyLinksCommand = new InvokeCommand(getNearbyLinksParams);
  const invocationResult = await lambda.send(getNearbyLinksCommand);

  const allRoadLinksS3Key = JSON.parse(
    Buffer.from(invocationResult.Payload).toString()
  ).key;

  const allRoadLinks: Array<FeatureRoadlinkMap> = await getObject(
    `dr-kunta-${process.env.STAGE_NAME}-bucket`,
    allRoadLinksS3Key
  );

  for (let p = 0; p < features.length; p++) {
    const feature = features[p];
    const roadLinks: Array<LinkObject> | undefined = allRoadLinks.find(
      (i) =>
        i.id === feature.properties.ID && i.type === feature.properties.TYPE
    )?.roadlinks;
    if (roadLinks) {
      switch (feature.properties.TYPE) {
        case 'OBSTACLE':
          var matchResults = matchObstacle(
            roadLinks,
            feature,
            geomFactory,
            MAX_OFFSET
          );
          break;
        case 'TRAFFICSIGN':
          var matchResults = matchTrafficSign(roadLinks, feature, geomFactory);
          break;
      }
      if (!matchResults) {
        console.error('matchResults is undefined');
        return;
      }

      if (matchResults.DR_REJECTED) {
        rejectsAmount++;
      }

      feature.properties = {
        ...feature.properties,
        ...matchResults
      };
    } else {
      rejectsAmount++;
      feature.properties.DR_REJECTED = true;
    }
  }

  const execDelta2SQLBody: PayloadFeature = {
    Created: delta.Created.filter(
      (feature: Feature) => !feature.properties.DR_REJECTED
    ),
    Deleted: delta.Deleted,
    Updated: delta.Updated.filter(
      (feature: Feature) => !feature.properties.DR_REJECTED
    ),
    metadata: {
      OFFSET_LIMIT: MAX_OFFSET,
      municipality: delta.metadata.municipality,
      assetType: delta.metadata.assetType
    }
  };

  const logsBody = {
    Rejected: {
      Created: delta.Created.filter(
        (feature: Feature) => feature.properties.DR_REJECTED
      ),
      Updated: delta.Updated.filter(
        (feature: Feature) => feature.properties.DR_REJECTED
      )
    },
    Accepted: {
      Created: delta.Created.filter(
        (feature: Feature) => !feature.properties.DR_REJECTED
      ),
      Deleted: delta.Deleted,
      Updated: delta.Updated.filter(
        (feature: Feature) => !feature.properties.DR_REJECTED
      )
    },
    invalidInfrao: delta.invalidInfrao,
    metadata: {
      OFFSET_LIMIT: MAX_OFFSET,
      municipality: delta.metadata.municipality,
      assetType: delta.metadata.assetType
    }
  };

  const now = new Date().toISOString().slice(0, 19);
  const putParams = {
    Bucket: `dr-kunta-${process.env.STAGE_NAME}-bucket`,
    Key: `matchRoadLink/${delta.metadata.municipality}/${now}.json`,
    Body: JSON.stringify(execDelta2SQLBody)
  };

  const putLogsParams = {
    Bucket: `dr-kunta-${process.env.STAGE_NAME}-bucket`,
    Key: `logs/${delta.metadata.municipality}/${now}.json`,
    Body: JSON.stringify(logsBody)
  };

  await new Upload({ client: s3, params: putLogsParams }).done();
  await new Upload({ client: s3, params: putParams }).done();

  const execDelta2SQLParams = {
    FunctionName: `DRKunta-${process.env.STAGE_NAME}-execDelta2SQL`,
    InvocationType: 'Event',
    Payload: Buffer.from(
      JSON.stringify({
        key: `matchRoadLink/${delta.metadata.municipality}/${now}.json`
      })
    )
  };

  const execDelta2SQLCommand = new InvokeCommand(execDelta2SQLParams);

  await lambda.send(execDelta2SQLCommand);

  const reportRejectedDeltabody = {
    assetType: delta.metadata.assetType,
    rejectsAmount: rejectsAmount,
    assetsAmount: delta.Created.length + delta.Updated.length,
    deletesAmount: delta.Deleted.length,
    invalidInfrao: delta.invalidInfrao,
    now: now
  };

  const reportRejectedDeltaParams = {
    FunctionName: `DRKunta-${process.env.STAGE_NAME}-reportRejectedDelta`,
    InvocationType: 'Event',
    Payload: Buffer.from(
      JSON.stringify({
        ReportType:
          rejectsAmount > 0 || delta.invalidInfrao.sum > 0
            ? 'matchedWithFailures'
            : 'matchedSuccessfully',
        Municipality: delta.metadata.municipality,
        Body: reportRejectedDeltabody
      })
    )
  };

  const reportRejectedDeltaCommand = new InvokeCommand(
    reportRejectedDeltaParams
  );

  await lambda.send(reportRejectedDeltaCommand);
};

export const main = middyfy(matchRoadLinks);
