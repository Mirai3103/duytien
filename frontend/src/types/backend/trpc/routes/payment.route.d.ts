export declare const paymentRoute: import("@trpc/server").TRPCBuiltRouter<{
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
    callback: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            momo?: any;
            vnpay?: any;
        };
        output: {
            success: boolean;
            message: string;
            payment: null;
            isPaymentSuccess?: undefined;
        } | {
            success: boolean;
            isPaymentSuccess: boolean;
            message: string;
            payment: {
                id: number;
                createdAt: Date;
                status: "pending" | "success" | "failed";
                orderId: number;
                amount: string;
                method: string | null;
                paymentDate: Date | null;
            };
        };
        meta: object;
    }>;
    createPayment: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            orderId: string;
        };
        output: {
            success: boolean;
            message: string;
            payment: null;
            redirectUrl?: undefined;
        } | {
            success: boolean;
            message: string;
            redirectUrl: string;
            payment?: undefined;
        };
        meta: object;
    }>;
    setOrderPaymentStatus: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            orderId: number;
            status: "pending" | "success" | "failed";
        };
        output: {
            success: boolean;
            message: string;
        };
        meta: object;
    }>;
}>>;
