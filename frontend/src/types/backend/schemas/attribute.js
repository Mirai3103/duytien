import { z } from "zod";
export const attributeSchema = z.object({
    id: z.number(),
    name: z.string(),
});
export const attributeValueSchema = z.object({
    id: z.number(),
    value: z.string(),
});
export const productRequiredAttributeSchema = z.object({
    productId: z.number(),
    attributeId: z.number(),
    defaultValue: z.string(),
});
export const createProductRequiredAttributeSchema = z.object({
    productId: z.number(),
    attribute: z.string(),
    defaultValue: z.string(),
});
