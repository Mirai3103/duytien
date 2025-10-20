export declare const categoriesRoute: import("@trpc/server").TRPCBuiltRouter<{
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
    getAllParentCategories: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            id: number;
            name: string;
            slug: string;
            parentId: number | null;
            metadata: {
                image?: string;
                totalProduct?: number;
                totalChild?: number;
            } | null;
            children: {
                id: number;
                name: string;
                slug: string;
                parentId: number | null;
                metadata: {
                    image?: string;
                    totalProduct?: number;
                    totalChild?: number;
                } | null;
            }[];
        }[];
        meta: object;
    }>;
    getByParentId: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            parentId: string;
        };
        output: {
            id: number;
            name: string;
            slug: string;
            parentId: number | null;
            metadata: {
                image?: string;
                totalProduct?: number;
                totalChild?: number;
            } | null;
            children: {
                id: number;
                name: string;
                slug: string;
                parentId: number | null;
                metadata: {
                    image?: string;
                    totalProduct?: number;
                    totalChild?: number;
                } | null;
            }[];
        }[];
        meta: object;
    }>;
    getAllParents: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            categoryId: string;
        };
        output: any;
        meta: object;
    }>;
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            name: string;
            slug: string;
            parentId: number | null;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    update: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            name: string;
            slug: string;
            parentId: number | null;
            id: string;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
    delete: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
}>>;
