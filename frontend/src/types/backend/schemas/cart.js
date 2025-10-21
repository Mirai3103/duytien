import z from "zod";
export const addToCartSchema = z.object({
    variantId: z.number(),
    quantity: z.number(),
});
export const removeFromCartSchema = z.object({
    cartItemId: z.number(),
});
export const updateCartItemSchema = z.object({
    cartItemId: z.number(),
    quantity: z.number(),
});
