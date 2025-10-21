import {
  and,
  asc,
  between,
  count,
  desc,
  eq,
  exists,
  ilike,
  inArray,
} from "drizzle-orm";
import z from "zod";
import db from "@/db";
import { categories, products, productVariants } from "@/db/schema";
import { publicProcedure, router } from "../trpc";
import {
  createProductSchema,
  productsQuerySchema,
  ProductStatus,
  updateProductSchema,
} from "@/schemas/product";
import type { inferProcedureOutput } from "@trpc/server";
import { CasingCache } from "drizzle-orm/casing";

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
  countProducts: publicProcedure
    .input(productsQuerySchema)
    .query(async ({ input }) => {
      const conditions = [
        exists(
          db
            .select({ id: productVariants.id })
            .from(productVariants)
            .where(eq(productVariants.productId, products.id))
        ),
      ];
      if (input.keyword) {
        conditions.push(ilike(products.name, `%${input.keyword}%`));
      }
      if (input.brandId) {
        conditions.push(inArray(products.brandId, input.brandId));
      }
      if (input.categoryId) {
        conditions.push(inArray(products.categoryId, input.categoryId));
      }
      if (input.status) {
        conditions.push(inArray(products.status, input.status));
      }
      if (input.price) {
        conditions.push(
          between(
            products.price,
            input.price.min?.toString() ?? "0",
            input.price.max?.toString() ?? "100000000"
          )
        );
      }
      return await db
        .select({ count: count() })
        .from(products)
        .where(and(...conditions));
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

        where(fields, operators) {
          console.log({ input });
          const conditions = [
            exists(
              db
                .select({ id: productVariants.id })
                .from(productVariants)
                .where(eq(productVariants.productId, fields.id))
            ),
          ];
          if (input.keyword) {
            conditions.push(ilike(fields.name, `%${input.keyword}%`));
          }
          if (input.brandId && input.brandId.length > 0) {
            conditions.push(inArray(fields.brandId, input.brandId));
          }
          if (input.categoryId && input.categoryId.length > 0) {
            conditions.push(inArray(fields.categoryId, input.categoryId));
          }
          if (input.status && input.status.length > 0) {
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
          console.log(conditions.length);
          if (conditions.length > 0) {
            return and(...conditions);
          }
          return undefined;
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
        orderBy(fields, operators) {
          const field =
            fields[input.sort?.field as keyof typeof fields] ||
            fields.createdAt;
          if (input.sort?.direction === "asc") {
            return asc(field);
          }
          return desc(field);
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
  getFeaturedProducts: publicProcedure
    .input(
      z.object({
        limit: z.number().default(10),
        offset: z.number().default(0),
        categoryId: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      let categoryIds: number[] = [];
      if (input.categoryId) {
        categoryIds.push(input.categoryId);
        // find all child categories
        const childCategories = await db.query.categories.findMany({
          where: eq(categories.parentId, input.categoryId),
          columns: {
            id: true,
          },
        });
        categoryIds.push(...childCategories.map((category) => category.id));
      }
      return await db.query.products.findMany({
        where(fields, operators) {
          const conditions = [eq(fields.isFeatured, true)];
          if (categoryIds.length > 0) {
            conditions.push(inArray(fields.categoryId, categoryIds));
          }
          return and(...conditions);
        },
        limit: input.limit,
        offset: input.offset,
      });
    }),
});

export type GetProductsResponse = inferProcedureOutput<
  typeof productsRoute.getProducts
>;
export type GetProductsWithVariantsResponse = inferProcedureOutput<
  typeof productsRoute.getProductsWithVariants
>;
export type GetProductDetailResponse = inferProcedureOutput<
  typeof productsRoute.getProductDetail
>;
export type GetProductsByCategoryIdResponse = inferProcedureOutput<
  typeof productsRoute.getProductsByCategoryId
>;

// getProductsWithVariants: publicProcedure
//   .input(productsQuerySchema)
//   .query(async ({ input }) => {
//     // 1. Query PRODUCTS (KHÔNG load variants)
//     const products = await db.query.products.findMany({
//       limit: input.limit,
//       offset: (input.page - 1) * input.limit,
//       columns: {
//         description: false,
//         metadata: false,
//       },
//       where(fields, operators) {
//         const conditions = [
//           exists(
//             db
//               .select({ id: productVariants.id })
//               .from(productVariants)
//               .where(eq(productVariants.productId, fields.id))
//           ),
//         ];
//         if (input.keyword) {
//           conditions.push(ilike(fields.name, `%${input.keyword}%`));
//         }
//         if (input.brandId && input.brandId.length > 0) {
//           conditions.push(inArray(fields.brandId, input.brandId));
//         }
//         if (input.categoryId && input.categoryId.length > 0) {
//           conditions.push(inArray(fields.categoryId, input.categoryId));
//         }
//         if (input.status && input.status.length > 0) {
//           conditions.push(inArray(fields.status, input.status));
//         }
//         if (input.price) {
//           conditions.push(
//             between(
//               fields.price,
//               input.price.min?.toString() ?? "0",
//               input.price.max?.toString() ?? "100000000"
//             )
//           );
//         }
//         if (conditions.length > 0) return and(...conditions);
//         return undefined;
//       },
//       with: {
//         brand: true,
//         category: true,
//       },
//       orderBy(fields, operators) {
//         const field =
//           fields[input.sort?.field as keyof typeof fields] ||
//           fields.createdAt;
//         if (input.sort?.direction === "asc") return asc(field);
//         return desc(field);
//       },
//     });

//     if (products.length === 0) return [];

//     // 2. Query VARIANTS theo productIds
//     const productIds = products.map((p) => p.id);

//     const variants = await db.query.productVariants.findMany({
//       where: inArray(productVariants.productId, productIds),
//       with: {
//         variantValues: {
//           with: {
//             value: {
//               with: {
//                 attribute: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     // 3. Group variants theo productId
//     const variantsByProductId = variants.reduce<Record<string, any[]>>(
//       (acc, variant) => {
//         const pid = variant.productId;
//         if (!acc[pid]) acc[pid] = [];
//         acc[pid].push(variant);
//         return acc;
//       },
//       {}
//     );

//     // 4. Merge
//     const merged = products.map((p) => ({
//       ...p,
//       variants: variantsByProductId[p.id] ?? [],
//     }));

//     return merged;
//   }),
