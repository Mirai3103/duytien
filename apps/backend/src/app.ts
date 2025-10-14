import "dotenv/config";

import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import { appRouter } from "./trpc";

const server = createHTTPServer({
	router: appRouter,
	middleware: cors({
		origin: "*",
	}),
});
server.listen(3000, "0.0.0.0");
console.log("Server is running on port 3000");
