import { z } from "zod";
export declare const attributeSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
}, z.core.$strip>;
export declare const attributeValueSchema: z.ZodObject<{
    id: z.ZodNumber;
    value: z.ZodString;
}, z.core.$strip>;
export declare const productRequiredAttributeSchema: z.ZodObject<{
    productId: z.ZodNumber;
    attributeId: z.ZodNumber;
    defaultValue: z.ZodString;
}, z.core.$strip>;
export type Attribute = z.infer<typeof attributeSchema>;
export type AttributeValue = z.infer<typeof attributeValueSchema>;
export type ProductRequiredAttribute = z.infer<typeof productRequiredAttributeSchema>;
export declare const createProductRequiredAttributeSchema: z.ZodObject<{
    productId: z.ZodNumber;
    attribute: z.ZodString;
    defaultValue: z.ZodString;
}, z.core.$strip>;
export type CreateProductRequiredAttribute = z.infer<typeof createProductRequiredAttributeSchema>;
