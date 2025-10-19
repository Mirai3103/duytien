import db from "@/db";
import { publicProcedure, router } from "../trpc";
import {
  createProductSpecSchema,
  createProductVariantSpecSchema,
  createSpecGroupSchema,
} from "@f5tech/schemas/spec";
import {
  productSpecs,
  productVariantSpecs,
  specGroups,
  specKeys,
  specValues,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";
import z from "zod";

async function upsertSpecGroup(name: string) {
  const existingSpecGroup = await db.query.specGroups.findFirst({
    where: eq(specGroups.name, name),
  });
  if (existingSpecGroup) {
    return existingSpecGroup.id;
  }
  return await db
    .insert(specGroups)
    .values({ name })
    .returning()
    .then((r) => r[0]!.id);
}

async function upsertSpecKey(name: string, groupId: number) {
  const existingSpecKey = await db.query.specKeys.findFirst({
    where: and(eq(specKeys.name, name), eq(specKeys.groupId, groupId)),
  });
  if (existingSpecKey) return existingSpecKey.id;
  return await db
    .insert(specKeys)
    .values({ name, groupId })
    .returning()
    .then((r) => r[0]!.id);
}

async function upsertSpecValue(value: string, keyId: number) {
  const existingSpecValue = await db.query.specValues.findFirst({
    where: and(eq(specValues.value, value), eq(specValues.keyId, keyId)),
  });
  if (existingSpecValue) return existingSpecValue.id;
  return await db
    .insert(specValues)
    .values({ value, keyId })
    .returning()
    .then((r) => r[0]!.id);
}

export const specsRoute = router({
  createSpecGroup: publicProcedure
    .input(createSpecGroupSchema)
    .mutation(async ({ input }) => {
      const { name } = input;
      const specGroupId = await upsertSpecGroup(name);
      return specGroupId;
    }),

  createProductSpec: publicProcedure
    .input(createProductSpecSchema)
    .mutation(async ({ input }) => {
      const { productId, groupId, key, value } = input;
      const specKeyId = await upsertSpecKey(key, groupId);
      const specValueId = await upsertSpecValue(value, specKeyId);
      await db
        .insert(productSpecs)
        .values({ productId, specValueId })
        .onConflictDoNothing();
      return { success: true };
    }),

  createProductVariantSpec: publicProcedure
    .input(createProductVariantSpecSchema)
    .mutation(async ({ input }) => {
      const { variantId, groupId, key, value } = input;
      const specKeyId = await upsertSpecKey(key, groupId);
      const specValueId = await upsertSpecValue(value, specKeyId);
      await db
        .insert(productVariantSpecs)
        .values({ variantId, specValueId })
        .onConflictDoNothing();
      return { success: true };
    }),
  removeProductSpec: publicProcedure
    .input(z.object({ productId: z.number(), specValueId: z.number() }))
    .mutation(async ({ input }) => {
      const { productId, specValueId } = input;
      await db
        .delete(productSpecs)
        .where(
          and(
            eq(productSpecs.productId, productId),
            eq(productSpecs.specValueId, specValueId)
          )
        );
      return { success: true };
    }),
  removeProductVariantSpec: publicProcedure
    .input(z.object({ variantId: z.number(), specValueId: z.number() }))
    .mutation(async ({ input }) => {
      const { variantId, specValueId } = input;
      await db
        .delete(productVariantSpecs)
        .where(
          and(
            eq(productVariantSpecs.variantId, variantId),
            eq(productVariantSpecs.specValueId, specValueId)
          )
        );
      return { success: true };
    }),
  getSpecGroups: publicProcedure.query(async () => {
    return await db.query.specGroups.findMany();
  }),
  getSpecKeys: publicProcedure.input(z.number()).query(async ({ input }) => {
    return await db.query.specKeys.findMany({
      where: eq(specKeys.groupId, input),
    });
  }),
  getSpecKeysOfGroup: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.query.specKeys.findMany({
        where: eq(specKeys.groupId, input),
      });
    }),
  getValidValueOfSpecKey: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.query.specValues.findMany({
        where: eq(specValues.keyId, input),
      });
    }),

  getProductSpecs: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.query.productSpecs.findMany({
        where: eq(productSpecs.productId, input),
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
      });
    }),
  getProductVariantSpecs: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.query.productVariantSpecs.findMany({
        where: eq(productVariantSpecs.variantId, input),
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
      });
    }),
});
