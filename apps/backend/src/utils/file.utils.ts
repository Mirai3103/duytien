import fs from "node:fs";
import type { Base64File } from "@f5tech/schemas/utils";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";

export const uploadBase64ToFile = (base64File?: Base64File | null) => {
	if (!base64File) return null;
	const { base64, fileName } = base64File;
	const file = Buffer.from(base64, "base64");
	fs.writeFileSync(`${UPLOAD_DIR}/${fileName}`, file);
	return fileName;
};

export const deleteFile = (fileName: Base64File["fileName"]) => {
	fs.unlinkSync(`${UPLOAD_DIR}/${fileName}`);
};

export const getFile = (fileName: Base64File["fileName"]) => {
	// return absolute path of the file
	return `${UPLOAD_DIR}/${fileName}`;
};
