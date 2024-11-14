import {
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  GetObjectCommand,
  ListObjectsV2Command,
  ListObjectsV2CommandOutput,
  S3
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { offline } from '@functions/config';

/**
 * @example '2024-10-10T10_42_24'
 */
export const now = () => new Date().toISOString().slice(0, 19).replaceAll(':', '_');

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
      Body: fileContent,
      Tagging: 'expireIn30=true'
    }
  }).done();
};

export const listS3Objects = async (
  bucketName: string,
  objectPrefix: string
): Promise<ListObjectsV2CommandOutput> =>
  await s3.send(
    new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: objectPrefix
    })
  );

export const getFromS3 = async (
  bucketName: string,
  fileName: string
): Promise<string> => {
  const s3Response = await s3.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: fileName
    })
  );
  if (!s3Response.Body) throw new Error('No body in S3 response');
  return s3Response.Body.transformToString();
};

export const deleteFromS3 = async (
  bucketName: string,
  fileName: string
): Promise<DeleteObjectCommandOutput> =>
  await s3.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: fileName
    })
  );
