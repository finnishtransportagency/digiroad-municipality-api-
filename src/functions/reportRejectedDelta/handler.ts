import { middyfy } from '@libs/lambda-tools';
import { createTransport } from 'nodemailer';
import * as ejs from 'ejs';
import * as path from 'path';
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

interface ReportRejectedDeltaEvent {
  ReportType: 'invalidData' | 'matchedWithFailures' | 'matchedSuccessfully';
  Municipality: string;
  Body: {
    now: string;
    stage: string;
    link: string;
    rejectsAmount: number;
    assetsAmount: number;
    deletesAmount: number;
    invalidInfraoSum: number;
    assetType: string;
    Message?: string;
  };
  S3Key: string;
}

const renderEmailContents = (municipality: string) => {
  const html = `
    <h1>Kuntarajapinta: ${municipality}</h1>
  `;
  const text = `Kuntarajapinta: ${municipality}`;
  return { html, text };
};

const sendEmail = async (event: ReportRejectedDeltaEvent) => {
  const transporter = createTransport({
    host: 'email-smtp.eu-west-1.amazonaws.com',
    port: 587,
    auth: {
      user: await getParameter(smtpusername),
      pass: await getParameter(smtppassword)
    }
  });
  const recipients = email.split(',');
  /* const municipalityEmail = await ejs.renderFile(
    path.resolve(__dirname, './templates/rejectedFeatures.ejs'),
    event
  ); */
  const emailContents = renderEmailContents(event.Municipality);
  const response = await transporter.sendMail({
    from: 'noreply.digiroad@vaylapilvi.fi',
    bcc: recipients,
    subject: `${stage} Digiroad kuntarajapinta: joitain kohteita ei voitu päivittää / Digiroad municipality API: some features could not be updated (${event.Municipality})`,
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
  const rejectedFeatures = castedLogs.Rejected.Created.concat(
    castedLogs.Rejected.Updated
  ).map((f) => {
    const { reason, feature } = f.properties as {
      reason: string;
      feature: { properties: { [k: string]: unknown } };
    };
    return {
      ...feature,
      properties: { ...feature.properties, reason }
    };
  });
  const rejected = initializeGeojson('rejected', event.Municipality);
  rejected.features.push(...rejectedFeatures);
  await uploadToS3(
    bucketName,
    `logs/rejected/${event.Municipality}/${event.Body.now}.json`,
    JSON.stringify(rejected)
  );

  const invalidInfrao = {
    reasons: castedLogs.invalidInfrao.IDs.reduce((reasons, f) => {
      const reason = f.properties.reason;
      reasons[reason] = reasons[reason] ? reasons[reason] + 1 : 1;
      return reasons;
    }, {} as { [k: string]: number }),
    features: castedLogs.invalidInfrao.IDs.map((f) => f.properties)
  };
  await uploadToS3(
    bucketName,
    `logs/invalidInfrao/${event.Municipality}/${event.Body.now}.json`,
    JSON.stringify(invalidInfrao)
  );
  if (offline) return;
  await sendEmail(event);
};

export const main = middyfy(reportRejectedDelta);
