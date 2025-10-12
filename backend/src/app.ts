import "dotenv/config";

import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { router } from "./server/trpc";
import { appRouter, type AppRouter } from "./trpc";
import cors from "cors";

const server = createHTTPServer({
  router: appRouter,
  middleware: cors({
    origin: "*",
  }),
});
server.listen(3000);
console.log("Server is running on port 3000");
