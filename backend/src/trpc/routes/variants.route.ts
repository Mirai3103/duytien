import { eq } from "drizzle-orm";
import z from "zod";
import db from "@/db";
import {
  productVariants,
  attributeValues as attributeValuesTable,
  productVariantValues as productVariantValuesTable,
} from "@/db/schema";
import { publicProcedure, router } from "../trpc";
import {
  createVariantSchema,
  updateVariantSchema,
  VariantStatus,
} from "@/schemas/variant";
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
export const variantsRoute = router({
  getVariants: publicProcedure.input(z.number()).query(async ({ input }) => {
    console.log(input);
    return await db.query.productVariants.findMany({
      columns: {
        metadata: false,
      },
      where: eq(productVariants.productId, input),
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
  }),
  getVariantDetail: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.query.productVariants.findFirst({
        where: eq(productVariants.id, input),
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
    }),

  createVariant: publicProcedure
    .input(createVariantSchema)
    .mutation(async ({ input }) => {
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

      return { success: true };
    }),
  updateVariant: publicProcedure
    .input(updateVariantSchema)
    .mutation(async ({ input }) => {
      await db
        .update(productVariants)
        .set({
          ...input,
          price: input.price.toString(),
        })
        .where(eq(productVariants.id, input.id));
      return { success: true };
    }),
  setVariantAttributes: publicProcedure
    .input(
      z.object({
        variantId: z.number(),
        attributeValues: z.array(
          z.object({ attributeId: z.number(), value: z.string() })
        ),
      })
    )
    .mutation(async ({ input }) => {
      await db
        .delete(productVariantValuesTable)
        .where(eq(productVariantValuesTable.variantId, input.variantId));

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
      return { success: true };
    }),
  deleteVariant: publicProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      await db.delete(productVariants).where(eq(productVariants.id, input));
      return { success: true };
    }),

  setDefaultVariant: publicProcedure
    .input(
      z.object({
        productId: z.number(),
        variantId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await db
        .update(productVariants)
        .set({ isDefault: false })
        .where(eq(productVariants.productId, input.productId));
      await db
        .update(productVariants)
        .set({ isDefault: true })
        .where(eq(productVariants.id, input.variantId));
      return { success: true };
    }),
  toggleVariantStatus: publicProcedure
    .input(
      z.object({
        variantId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await db
        .update(productVariants)
        .set({
          status:
            (productVariants.status as any) === VariantStatus.ACTIVE
              ? VariantStatus.INACTIVE
              : VariantStatus.ACTIVE,
        })
        .where(eq(productVariants.id, input.variantId));
      return { success: true };
    }),

  addStock: publicProcedure
    .input(
      z.object({
        variantId: z.number(),
        stock: z.number().min(0),
      })
    )
    .mutation(async ({ input }) => {
      await db
        .update(productVariants)
        .set({ stock: input.stock })
        .where(eq(productVariants.id, input.variantId));
      return { success: true };
    }),
  setPrice: publicProcedure
    .input(
      z.object({
        variantId: z.number(),
        price: z.number().min(0),
      })
    )
    .mutation(async ({ input }) => {
      await db
        .update(productVariants)
        .set({ price: input.price.toString() })
        .where(eq(productVariants.id, input.variantId));
      return { success: true };
    }),
});
