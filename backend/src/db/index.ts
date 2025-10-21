import { drizzle } from "drizzle-orm/node-postgres";
import schema from "./schema";

const db = drizzle(process.env.DATABASE_URL, { schema, logger: true });
console.log("Database connected");
export default db;
