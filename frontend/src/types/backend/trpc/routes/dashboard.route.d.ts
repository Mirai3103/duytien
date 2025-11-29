export declare const dashboardRoute: import("@trpc/server").TRPCBuiltRouter<{
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
    getStats: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            totalRevenue: number;
            revenueChange: number;
            totalOrders: number;
            ordersChange: number;
            totalProducts: number;
            productsChange: number;
            totalCustomers: number;
            customersChange: number;
        };
        meta: object;
    }>;
    getRevenueByMonth: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            month: string;
            revenue: number;
        }[];
        meta: object;
    }>;
    getRevenueByDay: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            day: string;
            revenue: number;
        }[];
        meta: object;
    }>;
    getOrdersByWeek: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            day: string;
            orders: number;
        }[];
        meta: object;
    }>;
    getRecentOrders: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            id: string;
            customer: string;
            product: string;
            amount: number;
            status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
        }[];
        meta: object;
    }>;
    getTopProducts: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            name: string;
            sales: number;
            percentage: number;
        }[];
        meta: object;
    }>;
}>>;
