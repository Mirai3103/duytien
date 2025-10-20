import { and, asc, between, desc, eq, ilike, inArray } from "drizzle-orm";
import z from "zod";
import db from "@/db";
import { products } from "@/db/schema";
import { publicProcedure, router } from "../trpc";
import {
  createProductSchema,
  productsQuerySchema,
  ProductStatus,
  updateProductSchema,
} from "@f5tech/schemas/product";
// import type { inferProcedureOutput } from "@trpc/server";

export const productsRoute = router({
  getProducts: publicProcedure
    .input(productsQuerySchema)
    .query(async ({ input }) => {
      return await db.query.products.findMany({
        limit: input.limit,
        offset: (input.page - 1) * input.limit,
        with: {
          brand: true,
          category: true,
        },
        where(fields, operators) {
          const conditions = [];
          if (input.keyword) {
            conditions.push(ilike(fields.name, `%${input.keyword}%`));
          }
          if (input.brandId) {
            conditions.push(inArray(fields.brandId, input.brandId));
          }
          if (input.categoryId) {
            conditions.push(inArray(fields.categoryId, input.categoryId));
          }
          if (input.status) {
            conditions.push(inArray(fields.status, input.status));
          }
          if (input.price) {
            conditions.push(
              between(
                fields.price,
                input.price.min?.toString() ?? "0",
                input.price.max?.toString() ?? "100000000"
              )
            );
          }
          if (conditions.length > 0) {
            return and(...conditions);
          }
          return undefined;
        },
        orderBy(fields, operators) {
          if (input.sort) {
            const { field, direction } = input.sort;
            if (field === "price") {
              return direction === "asc"
                ? asc(fields.price)
                : desc(fields.price);
            }
            if (field === "name") {
              return direction === "asc" ? asc(fields.name) : desc(fields.name);
            }
            if (field === "status") {
              return direction === "asc"
                ? asc(fields.status)
                : desc(fields.status);
            }
            if (field === "createdAt") {
              return direction === "asc"
                ? asc(fields.createdAt)
                : desc(fields.createdAt);
            }
          }
          return [asc(fields.createdAt)];
        },
      });
    }),
  getProductsWithVariants: publicProcedure
    .input(productsQuerySchema)
    .query(async ({ input }) => {
      return await db.query.products.findMany({
        limit: input.limit,
        offset: (input.page - 1) * input.limit,
        columns: {
          description: false,
          metadata: false,
        },
        with: {
          brand: true,
          category: true,
          variants: {
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
          },
        },
      });
    }),

  getProductDetail: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.query.products.findFirst({
        where: eq(products.id, input),
        with: {
          brand: true,
          category: true,
          variants: {
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
          },
        },
      });
    }),

  createProduct: publicProcedure
    .input(createProductSchema)
    .mutation(async ({ input }) => {
      await db.insert(products).values({
        ...input,
        price: input.price.toString(),
        createdAt: new Date(),
      });
      return { success: true };
    }),
  updateProduct: publicProcedure
    .input(updateProductSchema)
    .mutation(async ({ input }) => {
      const { id, ...rest } = input;
      await db
        .update(products)
        .set({
          ...rest,
          price: input.price.toString(),
        })
        .where(eq(products.id, id));
      return { success: true };
    }),
  deleteProduct: publicProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      await db.delete(products).where(eq(products.id, input));
      return { success: true };
    }),
  toggleProductStatus: publicProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      const product = await db.query.products.findFirst({
        where: eq(products.id, input),
      });
      if (!product) {
        throw new Error("Product not found");
      }
      await db
        .update(products)
        .set({
          status:
            product.status === ProductStatus.ACTIVE
              ? ProductStatus.INACTIVE
              : ProductStatus.ACTIVE,
        })
        .where(eq(products.id, input));
      return { success: true };
    }),

  getProductsByCategoryId: publicProcedure
    .input(
      z.object({
        categoryId: z.number(),
        limit: z.number().default(10),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      return await db.query.products.findMany({
        where: eq(products.categoryId, input.categoryId),
        limit: input.limit,
        offset: input.offset,
        with: {
          brand: true,
          category: true,
        },
      });
    }),
});

export type GetProductsResponse = Awaited<
  ReturnType<typeof productsRoute.getProducts>
>;
