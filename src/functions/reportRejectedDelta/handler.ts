import { middyfy } from '@libs/lambda';
import * as aws from 'aws-sdk';
import { SSM } from 'aws-sdk';
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import * as path from 'path';

const getParameter = async (name: string): Promise<string> => {
  const ssm = new SSM();
  const result = await ssm
    .getParameter({ Name: name, WithDecryption: true })
    .promise();
  return result.Parameter.Value;
};

const reportRejectedDelta = async (event) => {
  const s3 = new aws.S3();
  const now = new Date().toISOString().slice(0, 19);
  const municipality = event.Municipality;
  const params = {
    Bucket: `dr-kunta-${process.env.STAGE_NAME}-bucket`,
    Key: `logs/${municipality}/${now}`,
    Body: JSON.stringify(event)
  };

  await s3.upload(params).promise();

  var transporter = nodemailer.createTransport({
    host: 'email-smtp.eu-west-1.amazonaws.com',
    port: 587,
    auth: {
      user: await getParameter(process.env.SMTP_USERNAME_SSM_KEY),
      pass: await getParameter(process.env.SMTP_PASSWORD_SSM_KEY)
    }
  });
  let templateName: string;
  let emailSubject: string;

  const lambda = new aws.Lambda();

  const fetchEmailRecipientParams = {
    FunctionName: `digiroad-municipality-api-${process.env.STAGE_NAME}-fetchEmailRecipient`,
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify(event.Municipality)
  };
  let recipients = [];
  try {
    const fetchEmailRecipientResult = await lambda
      .invoke(fetchEmailRecipientParams)
      .promise();
    recipients = JSON.parse(
      fetchEmailRecipientResult.Payload.toString()
    ) as Array<string>;
  } catch (error) {
    console.error(error);
  }
  event.recipients = recipients;

  switch (event.ReportType) {
    case 'calculateDelta':
      templateName = 'invalidGeoJSON.ejs';
      emailSubject = 'Digiroad municipality API: upload rejected';
      break;
    case 'matchedWithFailures':
      templateName = 'rejectedFeatures.ejs';
      emailSubject =
        'Digiroad municipality API: some features could not be updated';
      recipients.push(process.env.OPERATOR_EMAIL);
      break;
    case 'matchedSuccessfully':
      return;
  }

  const municipalityEmail = await ejs.renderFile(
    path.resolve(__dirname, './templates/' + templateName),
    event
  );
  await transporter.sendMail({
    from: 'noreply.digiroad@vaylapilvi.fi',
    bcc: recipients,
    subject: emailSubject + ` (${event.Municipality})`,
    html: municipalityEmail
  });
};

export const main = middyfy(reportRejectedDelta);
