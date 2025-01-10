import { middyfy } from '@libs/lambda-tools';
import { createTransport } from 'nodemailer';
import {
  bucketName,
  email,
  offline,
  smtppassword,
  smtpusername,
  stage
} from '@functions/config';
import { getParameter } from '@libs/ssm-tools';
import { getFromS3, uploadToS3 } from '@libs/s3-tools';
import { logsSchema } from '@schemas/updatePayloadSchema';
import { AnyObject } from 'yup';
import { geoJsonSchema } from '@schemas/geoJsonSchema';

interface ReportRejectedDeltaEvent {
  Municipality: string;
  Body: {
    now: string;
    stage: string;
    rejectsAmount: number;
    assetsAmount: number;
    deletesAmount: number;
    assetType: string;
    Message?: string;
  };
  S3Key: string;
}

const renderEmailContents = (
  municipality: string,
  assetType: string,
  rejectsAmount: number,
  assetsAmount: number,
  invalidInfraoSum: number,
  deletesAmount: number,
  now: string
) => {
  const logsLink = `https://s3.console.aws.amazon.com/s3/object/${bucketName}?region=eu-west-1&prefix=logs/${municipality}/${now}.json`;
  const rejectedLink = `https://s3.console.aws.amazon.com/s3/object/${bucketName}?region=eu-west-1&prefix=logs/rejected/${municipality}/${assetType}/${now}.json`;
  const invalidInfraoLink = `https://s3.console.aws.amazon.com/s3/object/${bucketName}?region=eu-west-1&prefix=invalidInfrao/${municipality}/${assetType}/${now}.json`;
  const html = `
    <h1>Kuntarajapinta: ${municipality}</h1>
    <br/>
    <p>Tietolajin tyyppi: ${assetType}</p>
    <p>${rejectsAmount}/${assetsAmount} kohdetta hylätty sijainnin takia. (Uudet sekä päivitetyt)</p>
    <p>&emsp;<a href="${rejectedLink}">Linkki GeoJSON:iin S3:ssa</a></p>
    <p>${invalidInfraoSum} kohdetta hylätty kohteen ominaisuustietojen perusteella</p>
    <p>&emsp;<a href="${invalidInfraoLink}">Linkki GeoJSON:iin S3:ssa</a></p>
    <p>${deletesAmount} kohdetta poistettu (mukaan lukien ennestään hylätyt kohteet)</p>
    <p><a href="${logsLink}">Tarkista lokit s3:sesta</a></p>
    <p>Bucket: dr-kunta-${stage}-bucket</p>
    <p>Kansio/tiedosto: logs/${municipality}/${now}</p>
  `;
  const text = `Kuntarajapinta: ${municipality} \n
    Tietolajin tyyppi: ${assetType}\n
    ${rejectsAmount}/${assetsAmount} kohdetta hylätty sijainnin takia. (Uudet sekä päivitetyt)\n
        Linkki GeoJSON:iin S3:ssa: ${rejectedLink}
    ${invalidInfraoSum} kohdetta hylätty kohteen ominaisuustietojen perusteella\n
        Linkki GeoJSON:iin S3:ssa: ${invalidInfraoLink}
    ${deletesAmount} kohdetta poistettu (mukaan lukien ennestään hylätyt kohteet)\n
    Tarkista lokit s3:sesta: ${logsLink}\n
    Bucket: dr-kunta-${stage}-bucket\n
    Kansio/tiedosto: logs/${municipality}/${now}
  `;
  return { html, text };
};

const sendEmail = async (event: ReportRejectedDeltaEvent, invalidInfraoSum: number) => {
  const transporter = createTransport({
    host: 'email-smtp.eu-west-1.amazonaws.com',
    port: 587,
    auth: {
      user: await getParameter(smtpusername),
      pass: await getParameter(smtppassword)
    }
  });
  const recipients = email.split(',');
  const emailContents = renderEmailContents(
    event.Municipality,
    event.Body.assetType,
    event.Body.rejectsAmount,
    event.Body.assetsAmount,
    invalidInfraoSum,
    event.Body.deletesAmount,
    event.Body.now
  );
  const response = await transporter.sendMail({
    from: 'noreply.digiroad@vaylapilvi.fi',
    bcc: recipients,
    subject: `(${stage}) Digiroad kuntarajapinta: joitain kohteita ei voitu päivittää (${event.Municipality})`,
    html: emailContents.html,
    text: emailContents.text
  });
  console.log('SMTP response:\n' + response.response);
};

const initializeGeojson = (name: string, municipality: string) => {
  return {
    type: 'FeatureCollection',
    name: `${municipality}-${name}`,
    crs: {
      type: 'name',
      properties: {
        name: 'urn:ogc:def:crs:EPSG::3067'
      }
    },
    features: [] as Array<{ [k: string]: unknown }>
  };
};

const reportRejectedDelta = async (event: ReportRejectedDeltaEvent) => {
  const logs = JSON.parse(await getFromS3(bucketName, event.S3Key)) as AnyObject;
  const castedLogs = logsSchema.cast(logs, { context: logs });
  const rejectedFeatures = castedLogs.RejectedByLocation.rejected;
  const rejected = initializeGeojson('rejected', event.Municipality);
  rejected.features.push(...rejectedFeatures);
  await uploadToS3(
    bucketName,
    `logs/rejected/${event.Municipality}/${event.Body.assetType}/${event.Body.now}.json`,
    JSON.stringify(rejected)
  );

  if (offline) return;
  const invalidInfrao = JSON.parse(
    await getFromS3(
      bucketName,
      `invalidInfrao/${event.Municipality}/${event.Body.assetType}/${event.Body.now}.json`
    )
  ) as AnyObject;
  const castedInvalidInfrao = geoJsonSchema.cast(invalidInfrao);
  if (!geoJsonSchema.isValidSync(castedInvalidInfrao)) {
    console.error('Invalid logging for invalidInfrao');
    return;
  }
  const invalidInfraoSum = castedInvalidInfrao.features.length;
  if (invalidInfraoSum || event.Body.rejectsAmount)
    await sendEmail(event, invalidInfraoSum);
};

export const main = middyfy(reportRejectedDelta);
