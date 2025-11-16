import db from "@/db";
import {
  productVariants,
  attributeValues as attributeValuesTable,
  productVariantValues as productVariantValuesTable,
} from "@/db/schema";
import type z from "zod";
import {
  createVariantSchema,
  updateVariantSchema,
  VariantStatus,
} from "@/schemas/variant";
import { and, desc, eq, gt } from "drizzle-orm";
import { updateProductVariantsAggregateHook } from "@/db/hook";

async function upsertAttributeValue(attributeId: number, value: string) {
  const existingAttributeValue = await db.query.attributeValues.findFirst({
    where: (fields, { and, eq }) =>
      and(eq(fields.attributeId, attributeId), eq(fields.value, value)),
  });
  if (existingAttributeValue) {
    return existingAttributeValue.id;
  }
  const [attributeValue] = await db
    .insert(attributeValuesTable)
    .values({ attributeId, value })
    .returning();
  return attributeValue!.id;
}

export async function getVariants(productId: number) {
  console.log(productId);
  return await db.query.productVariants.findMany({
    columns: {
      metadata: false,
    },
    where: eq(productVariants.productId, productId),
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
}

export async function getVariantDetail(variantId: number) {
  return await db.query.productVariants.findFirst({
    where: eq(productVariants.id, variantId),
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
      specs: {
        with: {
          value: {
            with: {
              key: {
                with: {
                  group: true,
                },
              },
            },
          },
        },
      },
      images: true,
    },
  });
}

export async function getDefaultVariantDetail(productId: number) {
  // tìm variant có isDefault là true
  let variant = await db.query.productVariants.findFirst({
    where: and(
      eq(productVariants.productId, productId),
      eq(productVariants.isDefault, true)
    ),
  });
  // nếu ko có thì tìm cái còn stock lớn nhất
  if (!variant) {
    variant = await db.query.productVariants.findFirst({
      where: and(
        eq(productVariants.productId, productId),
        gt(productVariants.stock, 0)
      ),
      orderBy: [desc(productVariants.stock)],
    });
  }
  return variant;
}

export async function createVariant(
  input: z.infer<typeof createVariantSchema>
) {
  const { attributeValues, ...rest } = input;
  const [variant] = await db
    .insert(productVariants)
    .values({
      ...rest,
      price: rest.price.toString(),
    })
    .returning();
  for await (const attributeValue of attributeValues) {
    const attributeValueId = await upsertAttributeValue(
      attributeValue.attributeId,
      attributeValue.value
    );
    await db.insert(productVariantValuesTable).values({
      variantId: variant!.id,
      attributeValueId,
    });
  }

  updateProductVariantsAggregateHook(rest.productId);
  return { success: true };
}

export async function updateVariant(
  input: z.infer<typeof updateVariantSchema>
) {
  const { id, ...rest } = input;
  await db
    .update(productVariants)
    .set({
      ...rest,
      price: rest.price.toString(),
    })
    .where(eq(productVariants.id, id));
  updateProductVariantsAggregateHook(rest.productId);
  return { success: true };
}

export async function setVariantAttributes(input: {
  variantId: number;
  attributeValues: Array<{ attributeId: number; value: string }>;
}) {
  await db
    .delete(productVariantValuesTable)
    .where(eq(productVariantValuesTable.variantId, input.variantId));
  const productId = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, input.variantId),
    columns: {
      productId: true,
    },
  });
  for await (const av of input.attributeValues) {
    const attributeValueId = await upsertAttributeValue(
      av.attributeId,
      av.value
    );
    await db.insert(productVariantValuesTable).values({
      variantId: input.variantId,
      attributeValueId,
    });
  }
  updateProductVariantsAggregateHook(productId!.productId! as number);
  return { success: true };
}

export async function deleteVariant(variantId: number) {
  const productId = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, variantId),
    columns: {
      productId: true,
    },
  });
  await db.delete(productVariants).where(eq(productVariants.id, variantId));
  updateProductVariantsAggregateHook(productId!.productId! as number);
  return { success: true };
}

export async function setDefaultVariant(input: {
  productId: number;
  variantId: number;
}) {
  await db
    .update(productVariants)
    .set({ isDefault: false })
    .where(eq(productVariants.productId, input.productId));
  await db
    .update(productVariants)
    .set({ isDefault: true })
    .where(eq(productVariants.id, input.variantId));
  updateProductVariantsAggregateHook(input.productId);
  return { success: true };
}

export async function toggleVariantStatus(input: { variantId: number }) {
  await db
    .update(productVariants)
    .set({
      status:
        (productVariants.status as any) === VariantStatus.ACTIVE
          ? VariantStatus.INACTIVE
          : VariantStatus.ACTIVE,
    })
    .where(eq(productVariants.id, input.variantId));
  const productId = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, input.variantId),
    columns: {
      productId: true,
    },
  });
  updateProductVariantsAggregateHook(productId!.productId! as number);
  return { success: true };
}

export async function addStock(input: { variantId: number; stock: number }) {
  await db
    .update(productVariants)
    .set({ stock: input.stock })
    .where(eq(productVariants.id, input.variantId));
  const productId = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, input.variantId),
    columns: {
      productId: true,
    },
  });
  updateProductVariantsAggregateHook(productId!.productId! as number);
  return { success: true };
}

export async function setPrice(input: { variantId: number; price: number }) {
  await db
    .update(productVariants)
    .set({ price: input.price.toString() })
    .where(eq(productVariants.id, input.variantId));
  const productId = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, input.variantId),
    columns: {
      productId: true,
    },
  });
  updateProductVariantsAggregateHook(productId!.productId! as number);
  return { success: true };
}

