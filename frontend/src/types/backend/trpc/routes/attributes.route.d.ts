export declare const attributesRoute: import("@trpc/server").TRPCBuiltRouter<{
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
    getAllKeys: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            id: number;
            name: string;
        }[];
        meta: object;
    }>;
    createKey: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            name: string;
        };
        output: {
            id: number;
            name: string;
        } | undefined;
        meta: object;
    }>;
    getKeyByProductId: import("@trpc/server").TRPCQueryProcedure<{
        input: number;
        output: {
            productId: number;
            attributeId: number;
            defaultValue: string | null;
            attribute: {
                id: number;
                name: string;
            };
        }[];
        meta: object;
    }>;
    createProductRequiredAttribute: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            productId: number;
            attribute: string;
            defaultValue: string;
        };
        output: {
            success: boolean;
            id: number;
        };
        meta: object;
    }>;
    deleteProductRequiredAttribute: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            productId: number;
            attributeId: number;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
}>>;
