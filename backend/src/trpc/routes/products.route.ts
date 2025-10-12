import z from "zod";
import { publicProcedure, router } from "../trpc";
import db from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

export const productsQuerySchema = z.object({
  page: z.number().default(1),
  limit: z.number().max(200).default(10),
  keyword: z.string().optional(),
  brandId: z.array(z.number()).optional(),
  categoryId: z.array(z.number()).optional(),
  price: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
    })
    .optional(),
});

export const productsRoute = router({
  getProducts: publicProcedure
    .input(productsQuerySchema)
    .query(async ({ input }) => {
      return await db.query.products.findMany({
        limit: input.limit,
        offset: (input.page - 1) * input.limit,
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
});
