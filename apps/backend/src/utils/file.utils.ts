import fs from "node:fs";
import multerS3 from "multer-s3";
const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads/";
import multer from "multer";
import s3, { GetObjectCommand } from "./s3";
import path from "node:path";
import { Readable } from "node:stream";
const storageLocal = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const s3Storage = multerS3({
  s3,
  bucket: "uploads", //
  acl: "public-read", //
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (req: Express.Request, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});
const storage = process.env.STORAGE_TYPE === "local" ? storageLocal : s3Storage;

async function getS3FileByKey(key: string): Promise<NodeJS.ReadableStream> {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: key,
  });
  const data = await s3.send(command);
  if (!data.Body) {
    throw new Error("File not found");
  }
  const nodeStream = Readable.fromWeb(data.Body.transformToWebStream());
  return nodeStream;
}

export async function getLocalFileByKey(
  key: string
): Promise<NodeJS.ReadableStream> {
  const filePath = path.resolve(UPLOAD_DIR, key);
  await fs.promises.access(filePath, fs.constants.R_OK).catch(() => {
    throw new Error("File not found or not readable: " + key);
  });
  const fileStream = fs.createReadStream(filePath);
  return fileStream;
}

export const getFileByKey: (key: string) => Promise<NodeJS.ReadableStream> =
  process.env.STORAGE_TYPE === "local" ? getLocalFileByKey : getS3FileByKey;
const upload = multer({ storage });
export const uploadFile = upload.single("file");
