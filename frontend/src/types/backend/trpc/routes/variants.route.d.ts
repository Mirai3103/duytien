import { VariantStatus } from "@/schemas/variant";
import type { inferProcedureOutput } from "@trpc/server";
export declare const variantsRoute: import("@trpc/server").TRPCBuiltRouter<{
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
    getVariants: import("@trpc/server").TRPCQueryProcedure<{
        input: number;
        output: {
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
        }[];
        meta: object;
    }>;
    getVariantDetail: import("@trpc/server").TRPCQueryProcedure<{
        input: number;
        output: {
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
        } | undefined;
        meta: object;
    }>;
    getDefaultVariantDetail: import("@trpc/server").TRPCQueryProcedure<{
        input: number;
        output: {
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
        } | undefined;
        meta: object;
    }>;
    createVariant: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            name: string;
            image: string;
            status: VariantStatus;
            price: unknown;
            productId: number;
            sku: string;
            stock: unknown;
            isDefault: boolean;
            attributeValues: {
                attributeId: number;
                value: string;
            }[];
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    updateVariant: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: number;
            name: string;
            image: string;
            status: VariantStatus;
            price: unknown;
            productId: number;
            sku: string;
            stock: unknown;
            isDefault: boolean;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    setVariantAttributes: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            variantId: number;
            attributeValues: {
                attributeId: number;
                value: string;
            }[];
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    deleteVariant: import("@trpc/server").TRPCMutationProcedure<{
        input: number;
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    setDefaultVariant: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            productId: number;
            variantId: number;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    toggleVariantStatus: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            variantId: number;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    addStock: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            variantId: number;
            stock: number;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    setPrice: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            variantId: number;
            price: number;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
}>>;
export type GetVariantsResponse = inferProcedureOutput<typeof variantsRoute.getVariants>;
export type GetVariantDetailResponse = inferProcedureOutput<typeof variantsRoute.getVariantDetail>;
