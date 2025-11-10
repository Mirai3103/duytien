import { eq } from "drizzle-orm";
import db from "..";
import { productVariants } from "../schema";
import { products as productsTable } from "../schema";

const products = await db.query.products.findMany({
  columns: {
    id: true,
  },
});

for (const product of products) {
  console.log(`Processing product ${product.id}`);
  const variants = await db.query.productVariants.findMany({
    where: eq(productVariants.productId, product.id),
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
  });
  await db
    .update(productsTable)
    .set({
      variantsAggregate: variants,
    })
    .where(eq(productsTable.id, product.id));
}
