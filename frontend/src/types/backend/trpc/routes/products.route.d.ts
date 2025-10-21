import { ProductStatus } from "@/schemas/product";
import type { inferProcedureOutput } from "@trpc/server";
export declare const productsRoute: import("@trpc/server").TRPCBuiltRouter<{
    ctx: {
        session: {
            session: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                expiresAt: Date;
                token: string;
                ipAddress?: string | null | undefined | undefined;
                userAgent?: string | null | undefined | undefined;
            };
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined | undefined;
            };
        } | null;
    };
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    getProducts: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            page?: number | undefined;
            limit?: number | undefined;
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
        };
        output: {
            id: number;
            name: string;
            createdAt: Date;
            slug: string;
            isFeatured: boolean;
            metadata: any;
            description: string | null;
            brandId: number | null;
            categoryId: number | null;
            thumbnail: string | null;
            status: "active" | "inactive";
            price: string;
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
        }[];
        meta: object;
    }>;
    countProducts: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            page?: number | undefined;
            limit?: number | undefined;
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
        };
        output: {
            count: number;
        }[];
        meta: object;
    }>;
    getProductsWithVariants: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            page?: number | undefined;
            limit?: number | undefined;
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
        };
        output: {
            id: number;
            name: string;
            createdAt: Date;
            slug: string;
            isFeatured: boolean;
            brandId: number | null;
            categoryId: number | null;
            thumbnail: string | null;
            status: "active" | "inactive";
            price: string;
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
                metadata: any;
                status: "active" | "inactive";
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
            }[];
        }[];
        meta: object;
    }>;
    getProductDetail: import("@trpc/server").TRPCQueryProcedure<{
        input: number;
        output: {
            id: number;
            name: string;
            createdAt: Date;
            slug: string;
            isFeatured: boolean;
            metadata: any;
            description: string | null;
            brandId: number | null;
            categoryId: number | null;
            thumbnail: string | null;
            status: "active" | "inactive";
            price: string;
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
                metadata: any;
                status: "active" | "inactive";
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
            }[];
            specs: {
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
        } | undefined;
        meta: object;
    }>;
    createProduct: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            name: string;
            slug: string;
            status: ProductStatus;
            price: number;
            description?: any;
            brandId?: number | undefined;
            categoryId?: number | undefined;
            thumbnail?: string | undefined;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    updateProduct: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: number;
            name: string;
            slug: string;
            status: ProductStatus;
            price: number;
            description?: any;
            brandId?: number | undefined;
            categoryId?: number | undefined;
            thumbnail?: string | undefined;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    deleteProduct: import("@trpc/server").TRPCMutationProcedure<{
        input: number;
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    toggleProductStatus: import("@trpc/server").TRPCMutationProcedure<{
        input: number;
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    getProductsByCategoryId: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            categoryId: number;
            limit?: number | undefined;
            offset?: number | undefined;
        };
        output: {
            id: number;
            name: string;
            createdAt: Date;
            slug: string;
            isFeatured: boolean;
            metadata: any;
            description: string | null;
            brandId: number | null;
            categoryId: number | null;
            thumbnail: string | null;
            status: "active" | "inactive";
            price: string;
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
        }[];
        meta: object;
    }>;
    getFeaturedProducts: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            limit?: number | undefined;
            offset?: number | undefined;
            categoryId?: number | undefined;
        };
        output: {
            id: number;
            name: string;
            createdAt: Date;
            slug: string;
            isFeatured: boolean;
            metadata: any;
            description: string | null;
            brandId: number | null;
            categoryId: number | null;
            thumbnail: string | null;
            status: "active" | "inactive";
            price: string;
        }[];
        meta: object;
    }>;
}>>;
export type GetProductsResponse = inferProcedureOutput<typeof productsRoute.getProducts>;
export type GetProductsWithVariantsResponse = inferProcedureOutput<typeof productsRoute.getProductsWithVariants>;
export type GetProductDetailResponse = inferProcedureOutput<typeof productsRoute.getProductDetail>;
export type GetProductsByCategoryIdResponse = inferProcedureOutput<typeof productsRoute.getProductsByCategoryId>;
