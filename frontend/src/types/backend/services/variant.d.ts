import type z from "zod";
import { createVariantSchema, updateVariantSchema } from "@/schemas/variant";
export declare function getVariants(productId: number): Promise<{
    id: number;
    name: string;
    image: string | null;
    createdAt: Date;
    status: "active" | "inactive";
    price: string;
    discount: string | null;
    productId: number | null;
    sku: string;
    stock: number;
    isDefault: boolean | null;
    variantValues: {
        variantId: number;
        attributeValueId: number;
        value: {
            id: number;
            value: string;
            metadata: unknown;
            attributeId: number;
            attribute: {
                id: number;
                name: string;
            };
        };
    }[];
}[]>;
export declare function getVariantDetail(variantId: number): Promise<{
    id: number;
    name: string;
    image: string | null;
    createdAt: Date;
    status: "active" | "inactive";
    metadata: any;
    price: string;
    discount: string | null;
    productId: number | null;
    sku: string;
    stock: number;
    isDefault: boolean | null;
    specs: {
        isFeatured: boolean;
        variantId: number;
        specValueId: number;
        value: {
            id: number;
            value: string;
            keyId: number;
            key: {
                id: number;
                name: string;
                groupId: number;
                group: {
                    id: number;
                    name: string;
                };
            };
        };
    }[];
    variantValues: {
        variantId: number;
        attributeValueId: number;
        value: {
            id: number;
            value: string;
            metadata: unknown;
            attributeId: number;
            attribute: {
                id: number;
                name: string;
            };
        };
    }[];
    images: {
        id: number;
        image: string;
        variantId: number;
    }[];
} | undefined>;
export declare function getDefaultVariantDetail(productId: number): Promise<{
    id: number;
    name: string;
    image: string | null;
    createdAt: Date;
    status: "active" | "inactive";
    metadata: any;
    price: string;
    discount: string | null;
    productId: number | null;
    sku: string;
    stock: number;
    isDefault: boolean | null;
} | undefined>;
export declare function createVariant(input: z.infer<typeof createVariantSchema>): Promise<{
    success: boolean;
}>;
export declare function updateVariant(input: z.infer<typeof updateVariantSchema>): Promise<{
    success: boolean;
}>;
export declare function setVariantAttributes(input: {
    variantId: number;
    attributeValues: Array<{
        attributeId: number;
        value: string;
    }>;
}): Promise<{
    success: boolean;
}>;
export declare function deleteVariant(variantId: number): Promise<{
    success: boolean;
}>;
export declare function setDefaultVariant(input: {
    productId: number;
    variantId: number;
}): Promise<{
    success: boolean;
}>;
export declare function toggleVariantStatus(input: {
    variantId: number;
}): Promise<{
    success: boolean;
}>;
export declare function addStock(input: {
    variantId: number;
    stock: number;
}): Promise<{
    success: boolean;
}>;
export declare function setPrice(input: {
    variantId: number;
    price: number;
}): Promise<{
    success: boolean;
}>;
