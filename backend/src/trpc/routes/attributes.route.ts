import db from "@/db";
import { publicProcedure, router } from "../trpc";
import z from "zod";
import {
  attributes as attributesTable,
  attributeValues,
  productRequiredAttributes,
} from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { createProductRequiredAttributeSchema } from "@/schemas/attribute";
import { TRPCError } from "@trpc/server";
async function upsertAttribute(name: string) {
  const existingAttribute = await db.query.attributes.findFirst({
    where: eq(attributesTable.name, name),
  });
  if (existingAttribute) {
    return existingAttribute.id;
  }
  const [attribute] = await db
    .insert(attributesTable)
    .values({ name })
    .returning();
  return attribute!.id;
}
export const attributesRoute = router({
  getAllKeys: publicProcedure.query(async () => {
    return await db.query.attributes.findMany({
      columns: {
        id: true,
        name: true,
      },
    });
  }),

  createKey: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input }) => {
      const [attribute] = await db
        .insert(attributesTable)
        .values({ name: input.name })
        .returning();
      return attribute;
    }),
  getKeyByProductId: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.query.productRequiredAttributes.findMany({
        where: eq(productRequiredAttributes.productId, input),
        with: {
          attribute: true,
        },
      });
    }),
  createProductRequiredAttribute: publicProcedure
    .input(createProductRequiredAttributeSchema)
    .mutation(async ({ input }) => {
      const id = await upsertAttribute(input.attribute);
      await db.insert(productRequiredAttributes).values({
        productId: input.productId,
        attributeId: id,
        defaultValue: input.defaultValue,
      });
      return { success: true, id };
    }),
  deleteProductRequiredAttribute: publicProcedure
    .input(z.object({ productId: z.number(), attributeId: z.number() }))
    .mutation(async ({ input }) => {
      await db
        .delete(productRequiredAttributes)
        .where(
          and(
            eq(productRequiredAttributes.productId, input.productId),
            eq(productRequiredAttributes.attributeId, input.attributeId)
          )
        );
      return { success: true };
    }),
});
