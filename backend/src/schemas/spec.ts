import { z } from "zod";

export const createSpecGroupSchema = z.object({
  name: z.string(),
});

export const createProductSpecSchema = z.object({
  productId: z.number(),
  groupId: z.number(),
  key: z.string(),
  value: z.string(),
});

export const createProductVariantSpecSchema = z.object({
  variantId: z.number(),
  groupId: z.number(),
  key: z.string(),
  value: z.string(),
});
