import { and, eq, inArray } from "drizzle-orm";
import db from "..";
import {
  products,
  productVariants,
  productVariantSpecs,
  productSpecs,
  specValues,
  specKeys,
} from "../schema";

async function deduplicateVariantSpecs() {
  const allProducts = await db.select().from(products);

  for (const product of allProducts) {
    console.log(`🔍 Processing product: ${product.name}`);

    // 1️⃣ Lấy toàn bộ variants của product
    const variants = await db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, product.id));

    if (variants.length === 0) continue;

    // 2️⃣ Lấy toàn bộ specs của các variant
    const variantSpecsMap = new Map<number, any[]>();
    for (const variant of variants) {
      const specs = await db
        .select({
          specValueId: productVariantSpecs.specValueId,
          keyId: specValues.keyId,
          value: specValues.value,
        })
        .from(productVariantSpecs)
        .leftJoin(
          specValues,
          eq(specValues.id, productVariantSpecs.specValueId)
        )
        .where(eq(productVariantSpecs.variantId, variant.id));

      variantSpecsMap.set(variant.id, specs);
    }

    // 3️⃣ Tìm intersection các spec key/value chung giữa tất cả variants
    const allVariantSpecs = Array.from(variantSpecsMap.values());
    if (allVariantSpecs.length === 0) continue;

    const commonSpecs =
      allVariantSpecs
        .reduce(
          (common, curr) => {
            if (common === null) return curr;
            return common.filter((spec) =>
              curr.some((s) => s.keyId === spec.keyId && s.value === spec.value)
            );
          },
          null as any[] | null
        )
        ?.map((s) => s.specValueId) ?? [];

    if (commonSpecs.length === 0) {
      console.log("❌ No common specs found.");
      continue;
    }

    console.log(
      `✅ Found ${commonSpecs.length} common specs → promote to product`
    );

    // 4️⃣ Thêm vào bảng product_specs (nếu chưa có)
    for (const specValueId of commonSpecs) {
      const exists = await db.query.productSpecs.findFirst({
        where: (t, { and, eq }) =>
          and(eq(t.productId, product.id), eq(t.specValueId, specValueId)),
      });

      if (!exists) {
        await db.insert(productSpecs).values({
          productId: product.id,
          specValueId,
        });
      }
    }

    // 5️⃣ Xóa các spec này khỏi từng variant
    for (const variant of variants) {
      await db
        .delete(productVariantSpecs)
        .where(
          and(
            inArray(productVariantSpecs.specValueId, commonSpecs),
            eq(productVariantSpecs.variantId, variant.id)
          )
        );
    }

    console.log(`🧹 Cleaned common specs from variants of ${product.name}`);
  }

  console.log("🎉 Done!");
}

deduplicateVariantSpecs().catch(console.error);
