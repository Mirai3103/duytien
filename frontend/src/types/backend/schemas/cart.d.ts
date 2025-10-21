import z from "zod";
export declare const addToCartSchema: z.ZodObject<{
    variantId: z.ZodNumber;
    quantity: z.ZodNumber;
}, z.core.$strip>;
export declare const removeFromCartSchema: z.ZodObject<{
    cartItemId: z.ZodNumber;
}, z.core.$strip>;
export declare const updateCartItemSchema: z.ZodObject<{
    cartItemId: z.ZodNumber;
    quantity: z.ZodNumber;
}, z.core.$strip>;
