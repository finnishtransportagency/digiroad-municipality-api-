import { middyfy } from '@libs/lambda';
import * as aws from 'aws-sdk';
import findNearestLink from './findNearestLink';
import GeometryFactory from 'jsts/org/locationtech/jts/geom/GeometryFactory';
import PrecisionModel from 'jsts/org/locationtech/jts/geom/PrecisionModel';

import {
  PayloadFeature,
  Feature,
  LinkObject,
  FeatureRoadlinkMap
} from '@functions/typing';
import FilterByBearing from './FilterByBearing';

// Max offset permitted from middle of linestring
const MAX_OFFSET = 2;

const lambda = new aws.Lambda({ endpoint: 'http://localhost:3002' });

const matchRoadLinks = async (event) => {
  let rejectsAmount = 0;

  const features: Array<Feature> = event.Created.concat(event.Updated);
  const geomFactory = new GeometryFactory(new PrecisionModel(), 3067);

  const getNearbyLinksPayload = {
    features: features,
    municipality: event.metadata.municipality
  };
  const getNearbyLinksParams = {
    FunctionName: `DRKunta-${process.env.STAGE_NAME}-getNearbyLinks`,
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify(getNearbyLinksPayload)
  };

  try {
    const invocationResult = await lambda
      .invoke(getNearbyLinksParams)
      .promise();
    var allRoadLinks = JSON.parse(
      invocationResult.Payload.toString()
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
    console.log(JSON.stringify(feature.properties.ID));
    console.log(allRoadLinks.length);
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
          var matchResults = FilterByBearing(
            roadLinks,
            feature,
            geomFactory,
            MAX_OFFSET
          );
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
  console.log('--------- EXEC2DATABASE-----CREATED----', event.Created);
  console.log('--------- EXEC2DATABASE-----UPDATED----', event.Updated);

  const execDelta2SQLBody: PayloadFeature = {
    Created: event.Created.filter(
      (feature: Feature) => !feature.properties.DR_REJECTED
    ),
    Deleted: event.Deleted,
    Updated: event.Updated.filter(
      (feature: Feature) => !feature.properties.DR_REJECTED
    ),
    metadata: {
      OFFSET_LIMIT: MAX_OFFSET,
      municipality: event.metadata.municipality
    }
  };

  const execDelta2SQLParams = {
    FunctionName: `DRKunta-${process.env.STAGE_NAME}-execDelta2SQL`,
    InvocationType: 'Event',
    Payload: JSON.stringify(execDelta2SQLBody)
  };
  await lambda.invoke(execDelta2SQLParams).promise();

  const reportRejectedDeltabody: PayloadFeature = {
    Created: event.Created,
    Deleted: event.Deleted,
    Updated: event.Updated,
    metadata: {
      OFFSET_LIMIT: MAX_OFFSET,
      municipality: event.metadata.municipality
    }
  };

  const reportRejectedDeltaParams = {
    FunctionName: `DRKunta-${process.env.STAGE_NAME}-reportRejectedDelta`,
    InvocationType: 'Event',
    Payload: JSON.stringify({
      ReportType:
        rejectsAmount > 0 ? 'matchedWithFailures' : 'matchedSuccessfully',
      Municipality: event.metadata.municipality,
      Body: reportRejectedDeltabody
    })
  };
  await lambda.invoke(reportRejectedDeltaParams).promise();
};

export const main = middyfy(matchRoadLinks);
