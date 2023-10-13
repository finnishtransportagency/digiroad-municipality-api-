import { middyfy } from '@libs/lambda';
import { DrKuntaFeature } from '@functions/typing';
import { Upload } from '@aws-sdk/lib-storage';
import { S3, GetObjectCommand } from '@aws-sdk/client-s3';
import { Lambda, InvokeCommand } from '@aws-sdk/client-lambda';
import { XMLParser } from 'fast-xml-parser';
import parseObstacle from './datatypes/parseObstacles';
import parseTrafficsign from './datatypes/parseTrafficsigns';
import parseRoadSurface from './datatypes/parseRoadSurface';
import matchAdditionalPanels from './datatypes/matchAdditionalPanels';
import {
  trafficSignFeatureSchema,
  obstacleFeatureSchema,
  roadSurfaceFeatureSchema,
  additionalPanelSchema
} from './validationSchemas/validationSchema';

const parseXML = async (event) => {
  const now = new Date().toISOString().slice(0, 19);
  const s3 = new S3({});
  const lambda = new Lambda({});
  const key: string = decodeURIComponent(event.Records[0].s3.object.key);
  const municipality: string = key.split('/')[1];
  const assetType: string = key.split('/')[2];

  const sendReport = async (message: string) => {
    const invokeRejectedDeltaParams = {
      FunctionName: `DRKunta-${process.env.STAGE_NAME}-reportRejectedDelta`,
      InvocationType: 'Event',
      Payload: Buffer.from(
        JSON.stringify({
          ReportType: 'invalidData',
          Municipality: municipality,
          Body: { Message: message }
        })
      )
    };
    const invokeRejectedDeltaCommand = new InvokeCommand(
      invokeRejectedDeltaParams
    );
    await lambda.send(invokeRejectedDeltaCommand);
  };

  const getObjectParams = {
    Bucket: `dr-kunta-${process.env.STAGE_NAME}-bucket`,
    Key: key
  };

  const getObjectCommand = new GetObjectCommand(getObjectParams);
  try {
    const result = await s3.send(getObjectCommand);
    var xmlFile = await result.Body.transformToString();
  } catch (error) {
    console.error(`Could not retrieve file from s3: ${error.message}`);
    return;
  }

  const alwaysArray = [
    'FeatureCollection.featureMember',
    'FeatureCollection.featureMember.KatualueenOsa.sijaintitieto.Sijainti.alue.Polygon.interior',
    'FeatureCollection.featureMember.KatualueenOsa.sijaintitieto.Sijainti.alue.Polygon.exterior.LinearRing.pos',
    'FeatureCollection.featureMember.KatualueenOsa.sijaintitieto.Sijainti.alue.Polygon.interior.LinearRing.pos'
  ];
  //Assures that even if there is only one feature it makes it an array
  const options = {
    isArray: (_name, jpath) => {
      if (alwaysArray.indexOf(jpath) !== -1) return true;
    },
    removeNSPrefix: true
  };
  let schema;
  let APSchema;
  if (assetType === 'obstacles') {
    schema = obstacleFeatureSchema;
  }
  if (assetType === 'trafficSigns') {
    schema = trafficSignFeatureSchema;
    APSchema = additionalPanelSchema;
  }
  if (assetType === 'roadSurfaces') {
    schema = roadSurfaceFeatureSchema;
  }
  if (!schema) {
    throw new Error('Unknown assetType');
  }
  try {
    const parser = new XMLParser(options);
    const asJSON = parser.parse(xmlFile, true);
    const featureCollection = asJSON.FeatureCollection;
    const featureMembers = featureCollection.featureMember;
    let rejectsAmount = 0;
    const rejectedFeatures: Array<string> = [];
    const features: Array<DrKuntaFeature> = [];
    if (featureMembers) {
      if (assetType === 'obstacles') {
        for (const feature of featureMembers) {
          const obstacle = parseObstacle(feature.Rakenne, now);
          if (obstacle && schema.isValidSync(obstacle)) {
            features.push(schema.cast(obstacle));
          } else {
            rejectsAmount++;
            rejectedFeatures.push(feature.Rakenne['yksilointitieto']);
          }
        }
      }
      if (assetType === 'trafficSigns') {
        const additionalPanels = [];
        for (const feature of featureMembers) {
          const trafficSign = parseTrafficsign(feature.Liikennemerkki, now);
          if (trafficSign && schema.isValidSync(trafficSign)) {
            features.push(schema.cast(trafficSign));
          } else if (APSchema.isValidSync(trafficSign)) {
            additionalPanels.push(APSchema.cast(trafficSign));
          } else {
            rejectsAmount++;
            rejectedFeatures.push(feature.Liikennemerkki['yksilointitieto']);
          }
        }
        // Adds additional panels to features and return rejected additional panels
        const rejectedAditonalPanels = matchAdditionalPanels(
          features,
          additionalPanels
        );
        rejectedFeatures.concat(rejectedAditonalPanels);
        rejectsAmount += rejectedAditonalPanels.length;
      }
      if (assetType === 'roadSurfaces') {
        for (const feature of featureMembers) {
          const roadSurface = parseRoadSurface(feature.KatualueenOsa, now);
          if (roadSurface && schema.isValidSync(roadSurface)) {
            features.push(schema.cast(roadSurface));
          } else {
            rejectsAmount++;
            rejectedFeatures.push(feature.KatualueenOsa['yksilointitieto']);
          }
        }
      }
    }

    var geoJSON = {
      type: 'FeatureCollection',
      name: `${municipality}-Kuntarajapinta`,
      crs: {
        type: 'name',
        properties: {
          name: 'urn:ogc:def:crs:EPSG::3067'
        }
      },
      features: features,
      invalidInfrao: {
        sum: rejectsAmount,
        IDs: rejectedFeatures
      }
    };
  } catch (error) {
    console.error(
      `XML could not be parsed into valid GeoJSON: ${error.message}`
    );
    await sendReport(error.message);
    return;
  }

  const putParams = {
    Bucket: `dr-kunta-${process.env.STAGE_NAME}-bucket`,
    Key: `geojson/${municipality}/${assetType}/${now}.json`,
    Body: JSON.stringify(geoJSON)
  };

  await new Upload({
    client: s3,
    params: putParams
  }).done();
  return;
};

export const main = middyfy(parseXML);
