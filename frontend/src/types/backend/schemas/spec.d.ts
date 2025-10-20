import { z } from "zod";
export declare const createSpecGroupSchema: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strip>;
export declare const createProductSpecSchema: z.ZodObject<{
    productId: z.ZodNumber;
    groupId: z.ZodNumber;
    key: z.ZodString;
    value: z.ZodString;
}, z.core.$strip>;
export declare const createProductVariantSpecSchema: z.ZodObject<{
    variantId: z.ZodNumber;
    groupId: z.ZodNumber;
    key: z.ZodString;
    value: z.ZodString;
}, z.core.$strip>;
