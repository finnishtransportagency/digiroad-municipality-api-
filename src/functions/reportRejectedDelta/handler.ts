import { middyfy } from '@libs/lambda-tools';
import { createTransport } from 'nodemailer';
import * as ejs from 'ejs';
import * as path from 'path';
import { email, offline, smtppassword, smtpusername, stage } from '@functions/config';
import { getParameter } from '@libs/ssm-tools';

interface ReportRejectedDeltaEvent {
  ReportType: 'invalidData' | 'matchedWithFailures' | 'matchedSuccessfully';
  Municipality: string;
  Body: {
    now: string;
    stage: string;
    link: string;
    Message?: string;
  };
}

const reportRejectedDelta = async (event: ReportRejectedDeltaEvent) => {
  if (offline) return;
  const transporter = createTransport({
    host: 'email-smtp.eu-west-1.amazonaws.com',
    port: 587,
    auth: {
      user: await getParameter(smtpusername),
      pass: await getParameter(smtppassword)
    }
  });
  let templateName: string;
  let emailSubject: string;

  let subjectHeader = '';
  if (stage === 'dev') subjectHeader = '[DEV]';
  if (stage === 'test') subjectHeader = '[TEST]';

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

  const recipients = email.split(',');
  event.Body.stage = stage;
  event.Body.link = `https://s3.console.aws.amazon.com/s3/object/dr-kunta-${stage}-bucket?region=eu-west-1&prefix=logs/${event.Municipality}/${event.Body.now}.json`;
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
