import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
declare const s3: S3Client;
export default s3;
export { PutObjectCommand, GetObjectCommand };
