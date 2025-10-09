import 'dotenv/config';
import { drizzle } from "drizzle-orm/mysql2";
import schema from './schema';

const db = drizzle(process.env.DATABASE_URL!,{
    schema: schema,
    mode:'default'
});

export default db;