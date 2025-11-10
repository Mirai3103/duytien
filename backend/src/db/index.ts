// import { drizzle } from "drizzle-orm/node-postgres";
import schema from "./schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });
console.log("Database connected");
export default db;
