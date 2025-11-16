import z from "zod";
import { publicProcedure, router } from "../trpc";
import {
  createProductSchema,
  productsQuerySchema,
  updateProductSchema,
} from "@/schemas/product";
import type { inferProcedureOutput } from "@trpc/server";
import * as ProductService from "@/services/product";

export const productsRoute = router({
  getProducts: publicProcedure
    .input(productsQuerySchema)
    .query(async ({ input }) => {
      return await ProductService.getProducts(input);
    }),
  countProducts: publicProcedure
    .input(productsQuerySchema)
    .query(async ({ input }) => {
      return await ProductService.countProducts(input);
    }),
  getProductsWithVariants: publicProcedure
    .input(productsQuerySchema)
    .query(async ({ input }) => {
      return await ProductService.getProductsWithVariants(input);
    }),
  getProductDetail: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await ProductService.getProductDetail(input);
    }),
  createProduct: publicProcedure
    .input(createProductSchema)
    .mutation(async ({ input }) => {
      return await ProductService.createProduct(input);
    }),
  updateProduct: publicProcedure
    .input(updateProductSchema)
    .mutation(async ({ input }) => {
      return await ProductService.updateProduct(input);
    }),
  deleteProduct: publicProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return await ProductService.deleteProduct(input);
    }),
  toggleProductStatus: publicProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return await ProductService.toggleProductStatus(input);
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
      return await ProductService.getProductsByCategoryId(input);
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
      return await ProductService.getFeaturedProducts(input);
    }),
  setDiscount: publicProcedure
    .input(
      z.object({
        productId: z.number(),
        discount: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return await ProductService.setDiscount(input);
    }),
  getFlashSaleProducts: publicProcedure
    .input(
      z.object({
        limit: z.number().default(10),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      return await ProductService.getFlashSaleProducts(input);
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
