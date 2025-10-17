import { eq } from "drizzle-orm";
import db from "..";
import {
  productRequiredAttributes as productRequiredAttributesTable,
  productVariants as productVariantsTable,
  products as productsTable,
} from "../schema";

const products = await db.query.products.findMany();

for await (const product of products) {
  const setAttribute = new Set<number>();
  const variants = await db.query.productVariants.findMany({
    where: eq(productVariantsTable.productId, product.id),
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
  for await (const variant of variants) {
    for await (const variantValue of variant.variantValues) {
      setAttribute.add(variantValue.value.attribute.id);
    }
  }
  for await (const attributeId of setAttribute) {
    await db
      .insert(productRequiredAttributesTable)
      .values({
        productId: product.id,
        attributeId,
        defaultValue: "Unknown",
      })
      .onConflictDoNothing();
  }
}
