import { z } from "zod";
export declare enum VariantStatus {
    ACTIVE = "active",
    INACTIVE = "inactive"
}
export declare const attributeValueSchema: z.ZodObject<{
    attributeId: z.ZodNumber;
    value: z.ZodString;
}, z.core.$strip>;
export declare const variantSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    productId: z.ZodNumber;
    sku: z.ZodString;
    price: z.ZodCoercedNumber<unknown>;
    stock: z.ZodCoercedNumber<unknown>;
    image: z.ZodString;
    isDefault: z.ZodBoolean;
    status: z.ZodEnum<typeof VariantStatus>;
    createdAt: z.ZodDate;
}, z.core.$strip>;
export declare const createVariantSchema: z.ZodObject<{
    name: z.ZodString;
    productId: z.ZodNumber;
    price: z.ZodCoercedNumber<unknown>;
    status: z.ZodEnum<typeof VariantStatus>;
    sku: z.ZodString;
    stock: z.ZodCoercedNumber<unknown>;
    image: z.ZodString;
    isDefault: z.ZodBoolean;
    attributeValues: z.ZodArray<z.ZodObject<{
        attributeId: z.ZodNumber;
        value: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const updateVariantSchema: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    productId: z.ZodNumber;
    price: z.ZodCoercedNumber<unknown>;
    status: z.ZodEnum<typeof VariantStatus>;
    sku: z.ZodString;
    stock: z.ZodCoercedNumber<unknown>;
    image: z.ZodString;
    isDefault: z.ZodBoolean;
}, z.core.$strip>;
export type Variant = z.infer<typeof variantSchema>;
export type CreateVariant = z.infer<typeof createVariantSchema>;
export type UpdateVariant = z.infer<typeof updateVariantSchema>;
