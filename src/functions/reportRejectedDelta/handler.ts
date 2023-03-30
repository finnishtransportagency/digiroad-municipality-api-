import { middyfy } from '@libs/lambda';
import { Lambda, InvokeCommand } from '@aws-sdk/client-lambda';
import { Upload } from '@aws-sdk/lib-storage';
import { S3 } from '@aws-sdk/client-s3';
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
  const s3 = new S3({});
  const now = new Date().toISOString().slice(0, 19);
  const municipality = event.Municipality;
  const params = {
    Bucket: `dr-kunta-${process.env.STAGE_NAME}-bucket`,
    Key: `logs/${municipality}/${now}`,
    Body: JSON.stringify(event)
  };

  await new Upload({
    client: s3,
    params
  }).done();

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

  const lambda = new Lambda({});

  const fetchEmailRecipientParams = {
    FunctionName: `DRKunta-${process.env.STAGE_NAME}-fetchEmailRecipient`,
    InvocationType: 'RequestResponse',
    Payload: Buffer.from(JSON.stringify({ municipality: event.Municipality }))
  };

  const fetchEmailRecipientCommand = new InvokeCommand(
    fetchEmailRecipientParams
  );

  let recipients = [];
  try {
    const fetchEmailRecipientResult = await lambda.send(
      fetchEmailRecipientCommand
    );
    recipients = JSON.parse(
      Buffer.from(fetchEmailRecipientResult.Payload).toString()
    ) as Array<string>;
  } catch (error) {
    console.error(error);
  }
  event.recipients = recipients;

  const subjectHeader =
    process.env.STAGE_NAME === 'dev' || process.env.STAGE_NAME === 'test'
      ? '[TEST]'
      : '';

  switch (event.ReportType) {
    case 'calculateDelta':
      templateName = 'invalidGeoJSON.ejs';
      emailSubject = `${subjectHeader} Digiroad kuntarajapinta: lähetys hylätty / Digiroad municipality API: upload rejected`;
      if (process.env.STAGE_NAME === 'dev' || process.env.STAGE_NAME === 'test')
        recipients.push(process.env.OPERATOR_EMAIL);
      break;
    case 'matchedWithFailures':
      templateName = 'rejectedFeatures.ejs';
      emailSubject = `${subjectHeader} Digiroad kuntarajapinta: joitain kohteita ei voitu päivittää / Digiroad municipality API: some features could not be updated`;
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
