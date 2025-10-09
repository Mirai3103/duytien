import { sql } from "drizzle-orm";
import db from "..";
import {
  products as productsTable,
  productVariantValues as productVariantValuesTable,
} from "../schema";
import type { Variant } from "./type";
import { upsertAttribute, upsertAttributeValue } from "./utils";
import slugify from "slugify";

const skus = await db.query.productVariants.findMany({
  where: sql`NOT (${productsTable.metadata} ? 'isProcessSku')`,
});

for await (const sku of skus) {
  const metadata: any = sku.metadata;
  const variants = metadata.variants as Variant[];
  for await (const variant of variants) {
    const attributeId = await upsertAttribute(variant.propertyName);
    const value = variant.value;
    const displayValue = variant.displayValue;
    const attributeValueId = await upsertAttributeValue(
      attributeId,
      slugify(displayValue, { lower: true }),
      {
        displayValue,
        code: variant.code,
      }
    );
    const productVariantValueId = await db
      .insert(productVariantValuesTable)
      .values({
        attributeValueId,
        variantId: sku.id,
      })
      .onConflictDoNothing();
  }
}
