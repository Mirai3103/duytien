declare const usersRoute: import("@trpc/server").TRPCBuiltRouter<{
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
    searchUsers: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            page?: number | undefined;
            limit?: number | undefined;
            search?: string | undefined;
            emailVerified?: boolean | undefined;
            dateRange?: {
                from?: Date | undefined;
                to?: Date | undefined;
            } | null | undefined;
            orderBy?: "name" | "createdAt" | undefined;
            orderDirection?: "asc" | "desc" | undefined;
        };
        output: {
            users: {
                id: string;
                name: string;
                email: string;
                phone: string | null;
                image: string | null;
                emailVerified: boolean;
                createdAt: Date;
                orderCount: number;
            }[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        meta: object;
    }>;
    getMyProfile: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            id: string;
            name: string;
            email: string;
            emailVerified: boolean;
            phone: string | null;
            gender: string | null;
            dateOfBirth: Date | null;
            image: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | undefined;
        meta: object;
    }>;
    updateMyProfile: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            name?: string | undefined;
            phone?: string | undefined;
            gender?: "male" | "female" | "other" | undefined;
            dateOfBirth?: string | undefined;
            avatar?: string | undefined;
        };
        output: {
            success: boolean;
        };
        meta: object;
    }>;
}>>;
export { usersRoute };
