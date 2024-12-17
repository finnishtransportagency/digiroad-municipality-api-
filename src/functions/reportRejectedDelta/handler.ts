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

interface ReportRejectedDeltaEvent {
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

const renderEmailContents = (
  municipality: string,
  assetType: string,
  rejectsAmount: number,
  assetsAmount: number,
  invalidInfraoSum: number,
  deletesAmount: number,
  link: string,
  now: string
) => {
  const html = `
    <h1>Kuntarajapinta: ${municipality}</h1>
    <br/>
    <p>Tietolajin tyyppi: ${assetType}</p>
    <p>${rejectsAmount}/${assetsAmount} kohdetta hylätty sijainnin takia. (Uudet sekä päivitetyt)</p>
    <p>${invalidInfraoSum} kohdetta hylätty kohteen ominaisuustietojen perusteella</p>
    <p>${deletesAmount} kohdetta poistettu (mukaan lukien ennestään hylätyt kohteet)</p>
    <p><a href="${link}">Tarkista lokit s3:sesta</a></p>
    <p>Bucket: dr-kunta-${stage}-bucket</p>
    <p>Kansio/tiedosto: logs/${municipality}/${now}</p>
  `;
  const text = `Kuntarajapinta: ${municipality} \n
    Tietolajin tyyppi: ${assetType}\n
    ${rejectsAmount}/${assetsAmount} kohdetta hylätty sijainnin takia. (Uudet sekä päivitetyt)\n
    ${invalidInfraoSum} kohdetta hylätty kohteen ominaisuustietojen perusteella\n
    ${deletesAmount} kohdetta poistettu (mukaan lukien ennestään hylätyt kohteet)\n
    Tarkista lokit s3:sesta: ${link}\n
    Bucket: dr-kunta-${stage}-bucket\n
    Kansio/tiedosto: logs/${municipality}/${now}
  `;
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
  const emailContents = renderEmailContents(
    event.Municipality,
    event.Body.assetType,
    event.Body.rejectsAmount,
    event.Body.assetsAmount,
    event.Body.invalidInfraoSum,
    event.Body.deletesAmount,
    event.Body.link,
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
