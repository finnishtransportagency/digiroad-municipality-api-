import { middyfy } from '@libs/lambda';
import { Feature } from '@functions/typing';
import { Upload } from '@aws-sdk/lib-storage';
import { S3, GetObjectCommand } from '@aws-sdk/client-s3';
import { Lambda, InvokeCommand } from '@aws-sdk/client-lambda';
import { XMLParser } from 'fast-xml-parser';
import parseObstacle from './datatypes/parseObstacles';
import parseTrafficsign from './datatypes/parseTrafficsigns';
import { schema } from './validationSchemas/validationSchema';

const parseXML = async (event) => {
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

  const alwaysArray = ['FeatureCollection.featureMember'];
  //Assures that even if there is only one of a feature it makes it an array
  const options = {
    isArray: (_name, jpath) => {
      if (alwaysArray.indexOf(jpath) !== -1) return true;
    },
    removeNSPrefix: true
  };

  try {
    const parser = new XMLParser(options);
    const asJSON = parser.parse(xmlFile, true);
    const featureCollection = asJSON.FeatureCollection;
    const featureMembers = featureCollection.featureMember;

    const features: Array<Feature> = [];
    if (featureMembers) {
      for (const feature of featureMembers) {
        if (feature.Liikennemerkki) {
          features.push(parseTrafficsign(feature.Liikennemerkki));
          continue;
        }

        if (
          feature.Rakenne &&
          feature.Rakenne.rakenne === 'kulkuesteet (pollarit, puomit)'
        ) {
          features.push(parseObstacle(feature.Rakenne));
          continue;
        }
      }
    }
    const geoJSON = {
      type: 'FeatureCollection',
      name: `${municipality}-Kuntarajapinta`,
      crs: {
        type: 'name',
        properties: {
          name: 'urn:ogc:def:crs:EPSG::3067'
        }
      },
      features: features
    };

    const valid = await schema.validate(geoJSON);
    var validatedGeoJSON = schema.cast(valid);
  } catch (error) {
    console.error(
      `XML could not be parsed into valid GeoJSON: ${error.message}`
    );
    await sendReport(error.message);
    return;
  }

  const now = new Date().toISOString().slice(0, 19);
  const putParams = {
    Bucket: `dr-kunta-${process.env.STAGE_NAME}-bucket`,
    Key: `geojson/${municipality}/${assetType}/${now}.json`,
    Body: JSON.stringify(validatedGeoJSON)
  };

  await new Upload({
    client: s3,
    params: putParams
  }).done();
  return;
};

export const main = middyfy(parseXML);
