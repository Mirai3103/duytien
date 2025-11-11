import { eq } from "drizzle-orm";
import db from ".";
import { productVariants, products, vouchers as vouchersTable } from "./schema";

export async function updateProductVariantsAggregateHook(productId: number) {
  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
  });
  if (!product) {
    return;
  }
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
  const minPrice = Math.min(
    ...variants.map((variant) => parseFloat(variant.price))
  );
  await db
    .update(products)
    .set({
      variantsAggregate: variants,
      price: minPrice.toString(),
    })
    .where(eq(products.id, product.id));
}

export async function useVoucherHook(voucherId: number) {
  const voucher = await db.query.vouchers.findFirst({
    where: eq(vouchersTable.id, voucherId),
  });
  if (!voucher) {
    return;
  }
  await db.update(vouchersTable).set({
    usageCount: voucher.usageCount + 1,
  }).where(eq(vouchersTable.id, voucherId));
  return voucher;
}