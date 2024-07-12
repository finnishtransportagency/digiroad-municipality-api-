const { S3 } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const fs = require('fs');

new Upload({
  client: new S3({
    forcePathStyle: true,
    credentials: {
      accessKeyId: 'S3RVER',
      secretAccessKey: 'S3RVER'
    },
    endpoint: 'http://localhost:4569'
  }),
  params: {
    Bucket: process.argv[3],
    Key: `${process.argv[4]}${new Date()
      .toISOString()
      .slice(0, 19)}${process.argv[5]}`,
    Body: Buffer.from(fs.readFileSync(process.argv[2]).toString())
  }
}).done().then(() => {
  console.log('File uploaded successfully');
}).catch((err) => {
  console.error('Error uploading file:', err);
});
