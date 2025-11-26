import { Pool } from "@neondatabase/serverless";
import { drizzle as neon_dizzle } from "drizzle-orm/neon-serverless";
// import schema from "./schema";
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL!,
// });
// const db = drizzle(pool, { schema });

// console.log("Database connected");
// export default db;

// Make sure to install the 'pg' package
import { drizzle } from "drizzle-orm/node-postgres";
import schema from "./schema";
const DATABASE_URL = process.env.DATABASE_URL!;
let pool: Pool;
const isNeon = DATABASE_URL.includes("neon");
if (isNeon) {
  pool = new Pool({
    connectionString: DATABASE_URL,
  });
}
const db = isNeon
  ? neon_dizzle(pool!, { schema })
  : drizzle(process.env.DATABASE_URL!, { schema });
console.log(isNeon ? "Connected to Neon database" : "Connected to Postgres database");
export default db;
