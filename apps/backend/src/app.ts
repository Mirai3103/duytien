import "dotenv/config";
import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import { appRouter } from "./trpc";
import { getFileByKey, removeByKeys, uploadFile } from "./utils/file.utils";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import s3 from "./utils/s3";

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

app.post("/api/upload", uploadFile, (req: any, res) => {
  return res.json({
    message: " Upload thành công",
    file: req.file?.key || req.file?.path,
  });
});
app.get("/api/file/*path", async (req: any, res: any) => {
  try {
    const key = req.params.path.join("/"); // lấy toàn bộ phần sau /api/file/
    console.log("Requested file key:", key);

    const fileStream = await getFileByKey(key);
    return fileStream.pipe(res);
  } catch (error) {
    console.log("Error serving file:", error);
    return res.status(500).json({
      message: "Lỗi khi lấy file",
    });
  }
});
app.delete("/api/file/*path", async (req: any, res: any) => {
  try {
    const key = req.params.path.join("/");
    await removeByKeys([key]);
    return res.json({ message: "Xóa file thành công" });
  } catch (error) {
    console.log("Error deleting file:", error);
  }
});

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({});
type Context = Awaited<ReturnType<typeof createContext>>;
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
  })
);
app.listen(3000, "0.0.0.0");

console.log("Server is running on port 3000");
