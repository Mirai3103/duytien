import { sql } from "drizzle-orm";
import slugify from "slugify";
import db from "..";
import {
  products as productsTable,
  productVariantValues as productVariantValuesTable,
} from "../schema";
import type { Variant } from "./type";
import { upsertAttribute, upsertAttributeValue } from "./utils";

const skus = await db.query.productVariants.findMany({
  //   where: sql`NOT (${productsTable.metadata} ? 'isProcessSku')`,
});
// drop all product variant values
await db.delete(productVariantValuesTable);
for await (const sku of skus) {
  const metadata: any = sku.metadata;
  const variants = metadata.variants as Variant[];
  for await (const variant of variants) {
    const attributeId = await upsertAttribute(variant.propertyName);
    console.log(variant.propertyName);
    const _value = variant.value;
    const displayValue = variant.displayValue;
    const attributeValueId = await upsertAttributeValue(
      attributeId,
      displayValue,
      {
        displayValue,
        code: variant.code,
      }
    );
    const _productVariantValueId = await db
      .insert(productVariantValuesTable)
      .values({
        attributeValueId,
        variantId: sku.id,
      })
      .onConflictDoNothing();
  }
}
