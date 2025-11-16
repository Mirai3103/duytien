import z from "zod";
import { publicProcedure, router } from "../trpc";
import {
  createVariantSchema,
  updateVariantSchema,
} from "@/schemas/variant";
import type { inferProcedureOutput } from "@trpc/server";
import * as VariantService from "@/services/variant";
export const variantsRoute = router({
  getVariants: publicProcedure.input(z.number()).query(async ({ input }) => {
    return await VariantService.getVariants(input);
  }),
  getVariantDetail: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await VariantService.getVariantDetail(input);
    }),
  getDefaultVariantDetail: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await VariantService.getDefaultVariantDetail(input);
    }),
  createVariant: publicProcedure
    .input(createVariantSchema)
    .mutation(async ({ input }) => {
      return await VariantService.createVariant(input);
    }),
  updateVariant: publicProcedure
    .input(updateVariantSchema)
    .mutation(async ({ input }) => {
      return await VariantService.updateVariant(input);
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
      return await VariantService.setVariantAttributes(input);
    }),
  deleteVariant: publicProcedure
    .input(z.number())
    .mutation(async ({ input }) => {
      return await VariantService.deleteVariant(input);
    }),
  setDefaultVariant: publicProcedure
    .input(
      z.object({
        productId: z.number(),
        variantId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return await VariantService.setDefaultVariant(input);
    }),
  toggleVariantStatus: publicProcedure
    .input(
      z.object({
        variantId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return await VariantService.toggleVariantStatus(input);
    }),
  addStock: publicProcedure
    .input(
      z.object({
        variantId: z.number(),
        stock: z.number().min(0),
      })
    )
    .mutation(async ({ input }) => {
      return await VariantService.addStock(input);
    }),
  setPrice: publicProcedure
    .input(
      z.object({
        variantId: z.number(),
        price: z.number().min(0),
      })
    )
    .mutation(async ({ input }) => {
      return await VariantService.setPrice(input);
    }),
});

export type GetVariantsResponse = inferProcedureOutput<
  typeof variantsRoute.getVariants
>;
export type GetVariantDetailResponse = inferProcedureOutput<
  typeof variantsRoute.getVariantDetail
>;
