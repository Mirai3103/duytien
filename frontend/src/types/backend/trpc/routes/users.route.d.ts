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
