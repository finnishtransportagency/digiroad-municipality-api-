import { middyfy } from '@libs/lambda';
import { SSM, GetParameterCommand } from '@aws-sdk/client-ssm';
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import * as path from 'path';

const getParameter = async (name: string): Promise<string> => {
  const ssm = new SSM({});
  const getParametersCommand = new GetParameterCommand({
    Name: name,
    WithDecryption: true
  });
  const result = await ssm.send(getParametersCommand);
  return result.Parameter.Value;
};

const reportRejectedDelta = async (event) => {
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
