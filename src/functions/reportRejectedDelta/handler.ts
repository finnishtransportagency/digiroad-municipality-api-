import { middyfy } from '@libs/lambda';
import * as aws from 'aws-sdk';
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import * as path from 'path';

const reportRejectedDelta = async (event) => {
  console.log(JSON.stringify(event));
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
      user: `${process.env.SMTP_USERNAME}`,
      pass: `${process.env.SMTP_PASSWORD}`
    }
  });
  let templateName: string;
  let emailSubject: string;
  const recipients: Array<string> = [process.env.MUNICIPALITY_EMAIL];
  switch (event.ReportSource) {
    case 'calculateDelta':
      templateName = 'invalidGeoJSON.ejs';
      emailSubject = 'Digiroad municipality API: upload rejected';
      break;
    case 'matchRoadLink':
      templateName = 'rejectedFeatures.ejs';
      emailSubject =
        'Digiroad municipality API: some features could not be updated';
      recipients.push(process.env.OPERATOR_EMAIL);
      break;
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
