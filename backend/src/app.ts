import "dotenv/config";
import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import { appRouter } from "./trpc";
import { getFileByKey, removeByKeys, uploadFile } from "./utils/file.utils";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
import { convertToModelMessages, stepCountIs, streamText } from "ai";
import { llm } from "./llm";
import type { Request, Response } from "express";
import { prompt } from "./llm/prompt";
import { createAddToCartTool, getAllCategoriesTool, getProductDetailTool, getVariantDetailTool, searchProductTool } from "./llm/tools";
const app = express();
const corsOptions = cors({
  origin: [process.env.FRONTEND_URL!, "http://localhost:3000","http://localhost:5173"],
  credentials: true,
})
app.use(corsOptions);

// error handler
app.use((err: any, req: any, res: any, next: any) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render("error", { error: err });
});
app.all("/api/auth/*path", toNodeHandler(auth));
app.use(express.json());

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

app.post("/api/llm", async (req: Request, res: Response) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  const { messages } = req.body;
  const result = streamText({
    model: llm,
    system: prompt +session?.user?.id?`
     Biết rằng người dùng đang chat với bạn là ${JSON.stringify(session?.user)}
    `:``,
    tools: {
      searchProduct: searchProductTool,
      getProductDetail: getProductDetailTool,
      getVariantDetail: getVariantDetailTool,
      createAddToCart: createAddToCartTool(session?.user?.id!),
      getAllCategories: getAllCategoriesTool,
      
    },
    stopWhen:stepCountIs(10),
    messages:convertToModelMessages(messages),
  });

  return result.pipeUIMessageStreamToResponse(res);
});

const createContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  session: await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  }),
});
type Context = Awaited<ReturnType<typeof createContext>>;
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: createContext,
  })
);
app.listen(3000, "0.0.0.0");

console.log("Server is running on port 3000");
