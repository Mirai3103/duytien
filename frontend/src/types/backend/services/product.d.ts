import type z from "zod";
import { createProductSchema, productsQuerySchema, updateProductSchema } from "@/schemas/product";
export declare function getProducts(input: z.infer<typeof productsQuerySchema>): Promise<{
    id: number;
    name: string;
    createdAt: Date;
    status: "active" | "inactive";
    slug: string;
    isFeatured: boolean;
    metadata: any;
    description: string | null;
    brandId: number | null;
    categoryId: number | null;
    thumbnail: string | null;
    price: string;
    discount: string | null;
    variantsAggregate: {
        id: number;
        name: string;
        image: string | null;
        createdAt: Date;
        status: "active" | "inactive";
        metadata: any;
        price: string;
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
    }[] | null;
    brand: {
        id: number;
        name: string;
        slug: string;
        logo: string | null;
        isFeatured: boolean;
    } | null;
    category: {
        id: number;
        name: string;
        slug: string;
        parentId: number | null;
        metadata: {
            image?: string;
            totalProduct?: number;
            totalChild?: number;
        } | null;
    } | null;
}[]>;
export declare function countProducts(input: z.infer<typeof productsQuerySchema>): Promise<0 | {
    count: number;
}[]>;
export declare function getProductsWithVariants(input: z.infer<typeof productsQuerySchema>): Promise<{
    id: number;
    name: string;
    createdAt: Date;
    status: "active" | "inactive";
    slug: string;
    isFeatured: boolean;
    brandId: number | null;
    categoryId: number | null;
    thumbnail: string | null;
    price: string;
    discount: string | null;
    variantsAggregate: {
        id: number;
        name: string;
        image: string | null;
        createdAt: Date;
        status: "active" | "inactive";
        metadata: any;
        price: string;
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
    }[] | null;
    brand: {
        id: number;
        name: string;
        slug: string;
        logo: string | null;
        isFeatured: boolean;
    } | null;
    category: {
        id: number;
        name: string;
        slug: string;
        parentId: number | null;
        metadata: {
            image?: string;
            totalProduct?: number;
            totalChild?: number;
        } | null;
    } | null;
}[]>;
export declare function getProductDetail(productId: number): Promise<{
    id: number;
    name: string;
    createdAt: Date;
    status: "active" | "inactive";
    slug: string;
    isFeatured: boolean;
    metadata: any;
    description: string | null;
    brandId: number | null;
    categoryId: number | null;
    thumbnail: string | null;
    price: string;
    discount: string | null;
    brand: {
        id: number;
        name: string;
        slug: string;
        logo: string | null;
        isFeatured: boolean;
    } | null;
    category: {
        id: number;
        name: string;
        slug: string;
        parentId: number | null;
        metadata: {
            image?: string;
            totalProduct?: number;
            totalChild?: number;
        } | null;
    } | null;
    variants: {
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
    }[];
    specs: {
        isFeatured: boolean;
        productId: number;
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
} | undefined>;
export declare function createProduct(input: z.infer<typeof createProductSchema>): Promise<{
    success: boolean;
}>;
export declare function updateProduct(input: z.infer<typeof updateProductSchema>): Promise<{
    success: boolean;
}>;
export declare function deleteProduct(productId: number): Promise<{
    success: boolean;
}>;
export declare function toggleProductStatus(productId: number): Promise<{
    success: boolean;
}>;
export declare function getProductsByCategoryId(input: {
    categoryId: number;
    limit: number;
    offset: number;
}): Promise<{
    id: number;
    name: string;
    createdAt: Date;
    status: "active" | "inactive";
    slug: string;
    isFeatured: boolean;
    brandId: number | null;
    categoryId: number | null;
    thumbnail: string | null;
    price: string;
    discount: string | null;
    brand: {
        id: number;
        name: string;
        slug: string;
        logo: string | null;
        isFeatured: boolean;
    } | null;
    category: {
        id: number;
        name: string;
        slug: string;
        parentId: number | null;
        metadata: {
            image?: string;
            totalProduct?: number;
            totalChild?: number;
        } | null;
    } | null;
}[]>;
export declare function getFeaturedProducts(input: {
    limit: number;
    offset: number;
    categoryId?: number;
}): Promise<{
    id: number;
    name: string;
    createdAt: Date;
    status: "active" | "inactive";
    slug: string;
    isFeatured: boolean;
    brandId: number | null;
    categoryId: number | null;
    thumbnail: string | null;
    price: string;
    discount: string | null;
}[]>;
export declare function setDiscount(input: {
    productId: number;
    discount: number;
}): Promise<{
    success: boolean;
}>;
export declare function getFlashSaleProducts(input: {
    limit: number;
    offset: number;
}): Promise<{
    id: number;
    name: string;
    createdAt: Date;
    status: "active" | "inactive";
    slug: string;
    isFeatured: boolean;
    brandId: number | null;
    categoryId: number | null;
    thumbnail: string | null;
    price: string;
    discount: string | null;
}[]>;
