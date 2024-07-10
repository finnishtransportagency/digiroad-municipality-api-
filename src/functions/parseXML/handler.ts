import { invokeLambda, middyfy } from '@libs/lambda-tools';
import { DrKuntaFeature } from '@functions/typing';
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
import { S3Event } from 'aws-lambda';
import { getFromS3, uploadToS3 } from '@libs/s3-tools';
import { stage } from '@functions/config';

const parseXML = async (event: S3Event): Promise<void> => {
  const now = new Date().toISOString().slice(0, 19);
  const key: string = decodeURIComponent(event.Records[0].s3.object.key);
  const municipality: string = key.split('/')[1];
  const assetType: string = key.split('/')[2];

  let xmlFile: string;
  try {
    xmlFile = await getFromS3(`dr-kunta-${stage}-bucket`, key);
  } catch (e: unknown) {
    if (!(e instanceof Error)) throw e;
    throw new Error(`Could not retrieve file from s3: ${e.message}`);
  }

  const alwaysArray = [
    'FeatureCollection.featureMember',
    'FeatureCollection.featureMember.KatualueenOsa.sijaintitieto.Sijainti.alue.Polygon.interior',
    'FeatureCollection.featureMember.KatualueenOsa.sijaintitieto.Sijainti.alue.Polygon.exterior.LinearRing.pos',
    'FeatureCollection.featureMember.KatualueenOsa.sijaintitieto.Sijainti.alue.Polygon.interior.LinearRing.pos'
  ];
  //Assures that even if there is only one feature it makes it an array
  const options = {
    isArray: (_tagName: string, jpath: string) => {
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
  } catch (e: unknown) {
    if (!(e instanceof Error)) throw e;
    console.error(`XML could not be parsed into valid GeoJSON: ${e.message}`);
    await invokeLambda(
      'reportRejectedDelta',
      'Event',
      Buffer.from(
        JSON.stringify({
          ReportType: 'invalidData',
          Municipality: municipality,
          Body: { Message: e.message }
        })
      )
    );
    return;
  }

  await uploadToS3(
    `dr-kunta-${stage}-bucket`,
    `geojson/${municipality}/${assetType}/${now}.json`,
    JSON.stringify(geoJSON)
  );

  return;
};

export const main = middyfy(parseXML);
