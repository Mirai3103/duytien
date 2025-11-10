import db from "@/db";
import { products } from "@/db/schema";
import { asc } from "drizzle-orm";

const sql = await db.query.products
  .findMany({
    limit: 1,
    with: {
      brand: true,
      category: true,
      variants: {
        with: {
          variantValues: {
            with: {
              value: {
                with: {
                  attribute: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: asc(products.createdAt),
  })
  .toSQL();
console.log(sql);
Bun.write("sql.sql", sql.sql);
