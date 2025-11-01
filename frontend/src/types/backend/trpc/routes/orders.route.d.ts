export declare const ordersRoute: import("@trpc/server").TRPCBuiltRouter<{
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
    createOrder: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            cartItems: number[];
            shippingAddressId: number;
            paymentMethod: "cod" | "vnpay" | "momo";
            note?: string | undefined;
            voucherId?: number | undefined;
        };
        output: {
            success: boolean;
            message: string;
        };
        meta: object;
    }>;
    getOrders: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            page?: number | undefined;
            limit?: number | undefined;
        };
        output: {
            orders: {
                id: number;
                createdAt: Date;
                userId: string;
                status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
                totalAmount: string;
                paymentMethod: "cod" | "vnpay" | "momo";
                deliveryAddressId: number | null;
                voucherId: number | null;
                note: string | null;
                payments: {
                    id: number;
                    createdAt: Date;
                    status: "pending" | "success" | "failed";
                    orderId: number;
                    amount: string;
                    method: string | null;
                    paymentDate: Date | null;
                }[];
                items: {
                    price: string;
                    variantId: number;
                    quantity: number;
                    orderId: number;
                    variant: {
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
                    };
                }[];
            }[];
            total: number;
            page: number;
            limit: number;
        };
        meta: object;
    }>;
}>>;
