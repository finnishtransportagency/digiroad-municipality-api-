import { middyfy } from '@libs/lambda-tools';
import nodemailer from 'nodemailer';
import * as ejs from 'ejs';
import * as path from 'path';
import { offline } from '@functions/config';
import { getParameter } from '@libs/ssm-tools';

const reportRejectedDelta = async (event) => {
  if (offline) return;
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

  let subjectHeader = '';
  if (process.env.STAGE_NAME === 'dev') subjectHeader = '[DEV]';
  if (process.env.STAGE_NAME === 'test') subjectHeader = '[TEST]';

  switch (event.ReportType) {
    case 'invalidData':
      templateName = 'invalidData.ejs';
      emailSubject = `${subjectHeader} Digiroad kuntarajapinta: lähetys hylätty / Digiroad municipality API: upload rejected`;
      break;
    case 'matchedWithFailures':
      templateName = 'rejectedFeatures.ejs';
      emailSubject = `${subjectHeader} Digiroad kuntarajapinta: joitain kohteita ei voitu päivittää / Digiroad municipality API: some features could not be updated`;
      break;
    case 'matchedSuccessfully':
      return;
  }

  const recipients = process.env.OPERATOR_EMAIL.split(',');
  event.Body.stage = process.env.STAGE_NAME;
  event.Body.link = `https://s3.console.aws.amazon.com/s3/object/dr-kunta-${process.env.STAGE_NAME}-bucket?region=eu-west-1&prefix=logs/${event.Municipality}/${event.Body.now}.json`;
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
