import { ProductStatus } from "@/schemas/product";
export declare const searchProductTool: import("ai").Tool<{
    page: number;
    limit: number;
    keyword?: string | undefined;
    brandId?: number[] | undefined;
    categoryId?: number[] | undefined;
    sort?: {
        field?: "name" | "createdAt" | "status" | "price" | undefined;
        direction?: "asc" | "desc" | undefined;
    } | undefined;
    price?: {
        min?: number | undefined;
        max?: number | undefined;
    } | undefined;
    status?: ProductStatus[] | undefined;
}, {
    description: undefined;
    metadata: undefined;
    variantsAggregate: undefined;
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
export declare const getProductDetailTool: import("ai").Tool<{
    id: number;
}, {
    description: undefined;
    metadata: undefined;
    variantsAggregate: undefined;
    id?: number | undefined;
    name?: string | undefined;
    createdAt?: Date | undefined;
    status?: "active" | "inactive" | undefined;
    slug?: string | undefined;
    isFeatured?: boolean | undefined;
    brandId?: number | null | undefined;
    categoryId?: number | null | undefined;
    thumbnail?: string | null | undefined;
    price?: string | undefined;
    discount?: string | null | undefined;
    brand?: {
        id: number;
        name: string;
        slug: string;
        logo: string | null;
        isFeatured: boolean;
    } | null | undefined;
    category?: {
        id: number;
        name: string;
        slug: string;
        parentId: number | null;
        metadata: {
            image?: string;
            totalProduct?: number;
            totalChild?: number;
        } | null;
    } | null | undefined;
    variants?: {
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
    }[] | undefined;
    specs?: {
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
    }[] | undefined;
}>;
export declare const getAllCategoriesTool: import("ai").Tool<Record<string, never>, {
    id: number;
    name: string;
    slug: string;
    parentId: number | null;
    metadata: {
        image?: string;
        totalProduct?: number;
        totalChild?: number;
    } | null;
}[]>;
export declare const createAddToCartTool: (userId: string) => import("ai").Tool<{
    productVariantId: number;
    quantity: number;
}, {
    success: boolean;
}>;
export declare const getVariantDetailTool: import("ai").Tool<{
    id: number;
}, {
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
