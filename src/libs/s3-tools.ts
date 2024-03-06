import {
  GetObjectCommand,
  GetObjectCommandOutput,
  PutObjectCommandInput,
  S3
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { offline } from '@functions/config';

const s3 = new S3(
  offline
    ? {
        forcePathStyle: true,
        credentials: {
          accessKeyId: 'S3RVER', // This specific key is required when working offline
          secretAccessKey: 'S3RVER'
        },
        endpoint: 'http://localhost:4569'
      }
    : {}
);

export const uploadToS3 = async (
  bucketName: string,
  fileName: string,
  fileContent: string
): Promise<void> => {
  await new Upload({
    client: s3,
    params: {
      Bucket: bucketName,
      Key: fileName,
      Body: fileContent
    }
  }).done();
};

export const getFromS3 = async (
  bucketName: string,
  fileName: string
): Promise<GetObjectCommandOutput> =>
  await s3.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: fileName
    })
  );
