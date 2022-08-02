import { middyfy } from '@libs/lambda';
import * as aws from 'aws-sdk';
import nodemailer from 'nodemailer';

const reportRejectedDelta = async (event) => {
  const s3 = new aws.S3();
  const now = new Date().toISOString().slice(0, 19);
  const municipality = 'espoo';

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
  const info = await transporter.sendMail({
    from: 'noreply.digiroad@vaylapilvi.fi',
    to: process.env.MUNICIPALITY_EMAIL,
    subject: 'Rejected delta',
    text: 'Something wrong with delta',
    html: '<strong>Someething wrong with delta</strong>',
    headers: { 'x-myheader': 'test header' }
  });

  console.log('Message sent: %s', info.response);
};

export const main = middyfy(reportRejectedDelta);
