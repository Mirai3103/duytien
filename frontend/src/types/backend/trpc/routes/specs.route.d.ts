export declare const specsRoute: import("@trpc/server").TRPCBuiltRouter<{
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
    createSpecGroup: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            name: string;
        };
        output: number;
        meta: object;
    }>;
    createProductSpec: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            productId: number;
            groupId: number;
            key: string;
            value: string;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    createProductVariantSpec: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            variantId: number;
            groupId: number;
            key: string;
            value: string;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    removeProductSpec: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            productId: number;
            specValueId: number;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    removeProductVariantSpec: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            variantId: number;
            specValueId: number;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    toggleFeaturedProductSpec: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            productId: number;
            specValueId: number;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    toggleFeaturedProductVariantSpec: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            variantId: number;
            specValueId: number;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    getSpecGroups: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            id: number;
            name: string;
        }[];
        meta: object;
    }>;
    getSpecKeys: import("@trpc/server").TRPCQueryProcedure<{
        input: number;
        output: {
            id: number;
            name: string;
            groupId: number;
        }[];
        meta: object;
    }>;
    getSpecKeysOfGroup: import("@trpc/server").TRPCQueryProcedure<{
        input: number;
        output: {
            id: number;
            name: string;
            groupId: number;
        }[];
        meta: object;
    }>;
    getValidValueOfSpecKey: import("@trpc/server").TRPCQueryProcedure<{
        input: number;
        output: {
            id: number;
            value: string;
            keyId: number;
        }[];
        meta: object;
    }>;
    getProductSpecs: import("@trpc/server").TRPCQueryProcedure<{
        input: number;
        output: {
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
        meta: object;
    }>;
    getProductVariantSpecs: import("@trpc/server").TRPCQueryProcedure<{
        input: number;
        output: {
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
        meta: object;
    }>;
}>>;
