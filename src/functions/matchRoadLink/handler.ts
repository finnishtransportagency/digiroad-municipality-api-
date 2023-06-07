import { middyfy } from '@libs/lambda';
import { Lambda, InvokeCommand } from '@aws-sdk/client-lambda';
import { S3, GetObjectCommand } from '@aws-sdk/client-s3';
import findNearestLink from './findNearestLink';
import GeometryFactory from 'jsts/org/locationtech/jts/geom/GeometryFactory';
import PrecisionModel from 'jsts/org/locationtech/jts/geom/PrecisionModel';

import {
  PayloadFeature,
  Feature,
  LinkObject,
  FeatureRoadlinkMap
} from '@functions/typing';
import filterByBearing from './filterByBearing';

// Max offset permitted from middle of linestring
const MAX_OFFSET = 2;

const lambda = new Lambda({});
const s3 = new S3({});

const matchRoadLinks = async (event) => {
  const getObjectParams = {
    Bucket: `dr-kunta-${process.env.STAGE_NAME}-bucket`,
    Key: event.key
  };
  const getObjectsCommand = new GetObjectCommand(getObjectParams);
  const data = await s3.send(getObjectsCommand);
  const object = await data.Body.transformToString();
  const delta = JSON.parse(object);

  let rejectsAmount = 0;

  const features: Array<Feature> = delta.Created.concat(delta.Updated);
  const geomFactory = new GeometryFactory(new PrecisionModel(), 3067);

  const getNearbyLinksPayload = {
    features: features,
    municipality: delta.metadata.municipality
  };
  const getNearbyLinksParams = {
    FunctionName: `DRKunta-${process.env.STAGE_NAME}-getNearbyLinks`,
    InvocationType: 'RequestResponse',
    Payload: Buffer.from(JSON.stringify(getNearbyLinksPayload))
  };

  const getNearbyLinksCommand = new InvokeCommand(getNearbyLinksParams);

  try {
    const invocationResult = await lambda.send(getNearbyLinksCommand);
    var allRoadLinks = JSON.parse(
      Buffer.from(invocationResult.Payload).toString()
    ) as Array<FeatureRoadlinkMap>;
  } catch (error) {
    console.error(error);
  }
  for (let p = 0; p < features.length; p++) {
    const feature = features[p];
    const roadLinks: Array<LinkObject> | undefined = allRoadLinks.find(
      (i) =>
        i.id === feature.properties.ID && i.type === feature.properties.TYPE
    )?.roadlinks;
    if (roadLinks) {
      switch (feature.properties.TYPE) {
        case 'OBSTACLE':
          var matchResults = findNearestLink(
            roadLinks,
            feature,
            geomFactory,
            MAX_OFFSET
          );
          break;
        case 'TRAFFICSIGN':
          var matchResults = filterByBearing(
            roadLinks,
            feature,
            geomFactory,
            MAX_OFFSET
          );
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
      municipality: delta.metadata.municipality
    }
  };

  const execDelta2SQLParams = {
    FunctionName: `DRKunta-${process.env.STAGE_NAME}-execDelta2SQL`,
    InvocationType: 'Event',
    Payload: Buffer.from(JSON.stringify(execDelta2SQLBody))
  };

  const execDelta2SQLCommand = new InvokeCommand(execDelta2SQLParams);

  await lambda.send(execDelta2SQLCommand);

  const reportRejectedDeltabody: PayloadFeature = {
    Created: delta.Created,
    Deleted: delta.Deleted,
    Updated: delta.Updated,
    metadata: {
      OFFSET_LIMIT: MAX_OFFSET,
      municipality: delta.metadata.municipality
    }
  };

  const reportRejectedDeltaParams = {
    FunctionName: `DRKunta-${process.env.STAGE_NAME}-reportRejectedDelta`,
    InvocationType: 'Event',
    Payload: Buffer.from(
      JSON.stringify({
        ReportType:
          rejectsAmount > 0 ? 'matchedWithFailures' : 'matchedSuccessfully',
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
