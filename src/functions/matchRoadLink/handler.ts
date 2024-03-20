import { invokeLambda, middyfy } from '@libs/lambda-tools';
import matchTrafficSign from './trafficSigns/matchTrafficSign';
import matchObstacle from './obstacles/matchObstacle';
import matchSurface from './surface/matchSurface';
import combineSurfaces from './surface/combineSurfaces';
import GeometryFactory from 'jsts/org/locationtech/jts/geom/GeometryFactory';
import PrecisionModel from 'jsts/org/locationtech/jts/geom/PrecisionModel';

import {
  PayloadFeature,
  DrKuntaFeature,
  LinkObject,
  FeatureRoadlinkMap
} from '@functions/typing';
import { getFromS3, uploadToS3 } from '@libs/s3-tools';

// Max offset permitted from middle of linestring
const MAX_OFFSET = 2;

const now = new Date().toISOString().slice(0, 19);

const matchRoadLinks = async (event) => {
  async function getObject(bucket: string, objectKey: string) {
    try {
      const data = await getFromS3(bucket, objectKey);
      const object = await data.Body.transformToString();
      return JSON.parse(object);
    } catch (e: unknown) {
      if (!(e instanceof Error)) throw e;
      throw new Error(`Could not retrieve file from S3: ${e.message}`);
    }
  }

  const delta = await getObject(
    `dr-kunta-${process.env.STAGE_NAME}-bucket`,
    event.key
  );

  let rejectsAmount = 0;
  let features: Array<DrKuntaFeature> = delta.Created.concat(delta.Updated);
  if (delta.metadata.assetType === 'roadSurfaces') {
    features = combineSurfaces(features) as unknown as Array<DrKuntaFeature>;
    delta.Created = features;
    delta.Updated = [];
  }
  const geomFactory = new GeometryFactory(new PrecisionModel(), 3067);
  const getNearbyLinksPayload = {
    features: features,
    municipality: delta.metadata.municipality,
    assetType: delta.metadata.assetType
  };

  await uploadToS3(
    `dr-kunta-${process.env.STAGE_NAME}-bucket`,
    `getNearbyLinksRequestPayload/${delta.metadata.municipality}/${now}.json`,
    JSON.stringify(getNearbyLinksPayload)
  );

  const invocationResult = await invokeLambda(
    `DRKunta-${process.env.STAGE_NAME}-getNearbyLinks`,
    'RequestResponse',
    Buffer.from(
      JSON.stringify({
        key: `getNearbyLinksRequestPayload/${delta.metadata.municipality}/${now}.json`
      })
    )
  );

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
          var obstacleMatchResults = matchObstacle(
            roadLinks,
            feature,
            geomFactory,
            MAX_OFFSET
          );
          if (!obstacleMatchResults) {
            console.error('matchResult is undefined');
            return;
          }

          if (obstacleMatchResults.DR_REJECTED) {
            rejectsAmount++;
          }

          feature.properties = {
            ...feature.properties,
            ...obstacleMatchResults
          };
          break;
        case 'TRAFFICSIGN':
          var trafficSignMatchResults = matchTrafficSign(
            roadLinks,
            feature,
            geomFactory
          );
          if (!trafficSignMatchResults) {
            console.error('matchResult is undefined');
            return;
          }

          if (trafficSignMatchResults.DR_REJECTED) {
            rejectsAmount++;
          }

          feature.properties = {
            ...feature.properties,
            ...trafficSignMatchResults
          };
          break;
        case 'SURFACE':
          var surfaceMatchResults = matchSurface(
            roadLinks,
            feature,
            geomFactory
          );

          if (!surfaceMatchResults) {
            console.error('matchResult is undefined');
            return;
          }

          if (surfaceMatchResults.DR_REJECTED) {
            rejectsAmount++;
          }

          delete feature['geometry'];
          feature.properties = {
            ...feature.properties,
            ...surfaceMatchResults
          };
          break;
      }
    } else {
      rejectsAmount++;
      feature.properties.DR_REJECTED = true;
    }
  }
  const execDelta2SQLBody: PayloadFeature = {
    Created: delta.Created.filter(
      (feature: DrKuntaFeature) => !feature.properties.DR_REJECTED
    ),
    Deleted: delta.Deleted,
    Updated: delta.Updated.filter(
      (feature: DrKuntaFeature) => !feature.properties.DR_REJECTED
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
        (feature: DrKuntaFeature) => feature.properties.DR_REJECTED
      ),
      Updated: delta.Updated.filter(
        (feature: DrKuntaFeature) => feature.properties.DR_REJECTED
      )
    },
    Accepted: {
      Created: delta.Created.filter(
        (feature: DrKuntaFeature) => !feature.properties.DR_REJECTED
      ),
      Deleted: delta.Deleted,
      Updated: delta.Updated.filter(
        (feature: DrKuntaFeature) => !feature.properties.DR_REJECTED
      )
    },
    invalidInfrao: delta.invalidInfrao,
    metadata: {
      OFFSET_LIMIT: MAX_OFFSET,
      municipality: delta.metadata.municipality,
      assetType: delta.metadata.assetType
    }
  };

  await uploadToS3(
    `dr-kunta-${process.env.STAGE_NAME}-bucket`,
    `matchRoadLink/${delta.metadata.municipality}/${now}.json`,
    JSON.stringify(execDelta2SQLBody)
  );

  await uploadToS3(
    `dr-kunta-${process.env.STAGE_NAME}-bucket`,
    `logs/${delta.metadata.municipality}/${now}.json`,
    JSON.stringify(logsBody)
  );

  await invokeLambda(
    `DRKunta-${process.env.STAGE_NAME}-execDelta2SQL`,
    'Event',
    Buffer.from(
      JSON.stringify({
        key: `matchRoadLink/${delta.metadata.municipality}/${now}.json`
      })
    )
  );

  const reportRejectedDeltabody = {
    assetType: delta.metadata.assetType,
    rejectsAmount: rejectsAmount,
    assetsAmount: delta.Created.length + delta.Updated.length,
    deletesAmount: delta.Deleted.length,
    invalidInfrao: delta.invalidInfrao,
    now: now
  };

  await invokeLambda(
    `DRKunta-${process.env.STAGE_NAME}-reportRejectedDelta`,
    'Event',
    Buffer.from(
      JSON.stringify({
        ReportType:
          rejectsAmount > 0 || delta.invalidInfrao.sum > 0
            ? 'matchedWithFailures'
            : 'matchedSuccessfully',
        Municipality: delta.metadata.municipality,
        Body: reportRejectedDeltabody
      })
    )
  );
};

export const main = middyfy(matchRoadLinks);
