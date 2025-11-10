export declare const vouchersRoute: import("@trpc/server").TRPCBuiltRouter<{
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
    getVouchers: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            page?: number | undefined;
            limit?: number | undefined;
            keyword?: string | undefined;
            orderBy?: "createdAt" | "usageCount" | undefined;
            orderDirection?: "asc" | "desc" | undefined;
            type?: "fixed" | "percentage" | undefined;
        };
        output: {
            vouchers: {
                id: number;
                name: string;
                createdAt: Date;
                discount: string;
                code: string;
                type: "fixed" | "percentage";
                maxDiscount: string | null;
                minOrderAmount: string | null;
                maxOrderAmount: string | null;
                maxUsage: number | null;
                isActive: boolean;
                usageCount: number;
            }[];
            total: number;
        };
        meta: object;
    }>;
    checkVoucherCode: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            code: string;
        };
        output: {
            id: number;
            name: string;
            createdAt: Date;
            discount: string;
            code: string;
            type: "fixed" | "percentage";
            maxDiscount: string | null;
            minOrderAmount: string | null;
            maxOrderAmount: string | null;
            maxUsage: number | null;
            isActive: boolean;
            usageCount: number;
        } | undefined;
        meta: object;
    }>;
    toggleVoucherStatus: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: number;
        };
        output: {
            success: boolean;
            message: string;
        };
        meta: object;
    }>;
    createVoucher: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            code: string;
            name: string;
            type: "fixed" | "percentage";
            discount: number;
            maxDiscount?: number | undefined;
            minOrderAmount?: number | undefined;
            maxOrderAmount?: number | undefined;
            maxUsage?: number | undefined;
        };
        output: {
            id: number;
            name: string;
            createdAt: Date;
            discount: string;
            code: string;
            type: "fixed" | "percentage";
            maxDiscount: string | null;
            minOrderAmount: string | null;
            maxOrderAmount: string | null;
            maxUsage: number | null;
            isActive: boolean;
            usageCount: number;
        } | undefined;
        meta: object;
    }>;
    updateVoucher: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: number;
            code: string;
            name: string;
            type: "fixed" | "percentage";
            discount: number;
            maxDiscount?: number | undefined;
            minOrderAmount?: number | undefined;
            maxOrderAmount?: number | undefined;
            maxUsage?: number | undefined;
        };
        output: {
            id: number;
            name: string;
            code: string;
            type: "fixed" | "percentage";
            discount: string;
            maxDiscount: string | null;
            minOrderAmount: string | null;
            maxOrderAmount: string | null;
            maxUsage: number | null;
            isActive: boolean;
            usageCount: number;
            createdAt: Date;
        } | undefined;
        meta: object;
    }>;
    deleteVoucher: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: number;
        };
        output: {
            success: boolean;
            message: string;
        };
        meta: object;
    }>;
}>>;
