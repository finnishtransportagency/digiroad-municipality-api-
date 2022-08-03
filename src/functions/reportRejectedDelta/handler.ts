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

  if (event.ReportSource === 'calculateDelta') {
    const email = await ejs.renderFile(
      path.resolve(
        __dirname,
        './templates/municipality/' + 'InvalidGeoJSON.ejs'
      ),
      event
    );
    await transporter.sendMail({
      from: 'noreply.digiroad@vaylapilvi.fi',
      to: process.env.MUNICIPALITY_EMAIL,
      subject: 'Digiroad municipality API: upload rejected',
      html: email
    });
  } else if (event.ReportSource === 'matchRoadLink') {
    const email = await ejs.renderFile(
      path.resolve(
        __dirname,
        './templates/municipality/' + 'RejectedFeatures.ejs'
      ),
      event
    );
    await transporter.sendMail({
      from: 'noreply.digiroad@vaylapilvi.fi',
      to: process.env.MUNICIPALITY_EMAIL,
      subject: 'Digiroad municipality API: some features could not be updated',
      html: email
    });
  }
};

export const main = middyfy(reportRejectedDelta);
