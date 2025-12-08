import { type inferProcedureOutput } from "@trpc/server";
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
            installmentCount?: number | undefined;
            payType?: "full" | "partial" | undefined;
            identityId?: string | undefined;
            fullName?: string | undefined;
        };
        output: {
            success: boolean;
            message: string;
            redirectUrl: string;
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
                totalAmount: string;
                status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
                userId: string;
                code: string;
                paymentMethod: "cod" | "vnpay" | "momo";
                payType: "full" | "partial";
                deliveryAddressId: number | null;
                voucherId: number | null;
                totalItems: number;
                lastPaymentId: number | null;
                note: string | null;
                identityId: string | null;
                full_name: string | null;
                nextPayDay: Date | null;
                nextPayAmount: string | null;
                installmentCount: number | null;
                remainingInstallments: number | null;
                totalPaidAmount: string | null;
                voucher: {
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
                } | null;
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
                        status: "active" | "inactive";
                        metadata: any;
                        price: string;
                        discount: string | null;
                        productId: number | null;
                        sku: string;
                        stock: number;
                        isDefault: boolean | null;
                        product: {
                            id: number;
                            name: string;
                            createdAt: Date;
                            status: "active" | "inactive";
                            slug: string;
                            isFeatured: boolean;
                            metadata: any;
                            description: string | null;
                            brandId: number | null;
                            categoryId: number | null;
                            thumbnail: string | null;
                            price: string;
                            discount: string | null;
                            variantsAggregate: {
                                id: number;
                                name: string;
                                image: string | null;
                                createdAt: Date;
                                status: "active" | "inactive";
                                metadata: any;
                                price: string;
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
                            }[] | null;
                        } | null;
                        variantValues: {
                            variantId: number;
                            attributeValueId: number;
                            value: {
                                id: number;
                                value: string;
                                metadata: unknown;
                                attributeId: number;
                            };
                        }[];
                    };
                }[];
                lastPayment: {
                    id: number;
                    createdAt: Date;
                    status: "pending" | "success" | "failed";
                    orderId: number;
                    amount: string;
                    method: string | null;
                    paymentDate: Date | null;
                } | null;
                deliveryAddress: {
                    id: number;
                    phone: string;
                    userId: string | null;
                    isDefault: boolean;
                    note: string | null;
                    detail: string;
                    ward: string;
                    province: string;
                    fullName: string;
                    isHidden: boolean;
                } | null;
            }[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        meta: object;
    }>;
    getStatusStats: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            statusStats: {
                status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
                count: number;
            }[];
            totalOrders: number;
        };
        meta: object;
    }>;
    searchOrders: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            page?: number | undefined;
            limit?: number | undefined;
            search?: string | undefined;
            status?: ("pending" | "shipping" | "delivered" | "cancelled")[] | undefined;
            paymentMethod?: "cod" | "vnpay" | "momo" | "all" | undefined;
            paymentStatus?: "pending" | "success" | "failed" | undefined;
            dateRange?: {
                from?: Date | undefined;
                to?: Date | undefined;
            } | null | undefined;
            orderBy?: "createdAt" | "totalAmount" | undefined;
            orderDirection?: "asc" | "desc" | undefined;
        };
        output: {
            orders: {
                vouchers: {
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
                } | null;
                payments: {
                    id: number;
                    orderId: number;
                    amount: string;
                    method: string | null;
                    status: "pending" | "success" | "failed";
                    paymentDate: Date | null;
                    createdAt: Date;
                } | null;
                orders: {
                    id: number;
                    code: string;
                    userId: string;
                    status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
                    totalAmount: string;
                    paymentMethod: "cod" | "vnpay" | "momo";
                    payType: "full" | "partial";
                    deliveryAddressId: number | null;
                    createdAt: Date;
                    voucherId: number | null;
                    totalItems: number;
                    lastPaymentId: number | null;
                    note: string | null;
                    identityId: string | null;
                    full_name: string | null;
                    nextPayDay: Date | null;
                    nextPayAmount: string | null;
                    installmentCount: number | null;
                    remainingInstallments: number | null;
                    totalPaidAmount: string | null;
                };
                u_table: {
                    id: string;
                    name: string;
                    email: string;
                    emailVerified: boolean;
                    phone: string | null;
                    gender: string | null;
                    dateOfBirth: Date | null;
                    image: string | null;
                    createdAt: Date;
                    totalOrders: number;
                    totalAmount: string;
                    status: string;
                    role: string;
                    updatedAt: Date;
                } | null;
            }[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        meta: object;
    }>;
    getOrder: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: number;
        };
        output: {
            id: number;
            createdAt: Date;
            totalAmount: string;
            status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
            userId: string;
            code: string;
            paymentMethod: "cod" | "vnpay" | "momo";
            payType: "full" | "partial";
            deliveryAddressId: number | null;
            voucherId: number | null;
            totalItems: number;
            lastPaymentId: number | null;
            note: string | null;
            identityId: string | null;
            full_name: string | null;
            nextPayDay: Date | null;
            nextPayAmount: string | null;
            installmentCount: number | null;
            remainingInstallments: number | null;
            totalPaidAmount: string | null;
            user: {
                id: string;
                name: string;
                email: string;
                emailVerified: boolean;
                phone: string | null;
                gender: string | null;
                dateOfBirth: Date | null;
                image: string | null;
                createdAt: Date;
                totalOrders: number;
                totalAmount: string;
                status: string;
                role: string;
                updatedAt: Date;
            };
            voucher: {
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
            } | null;
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
                    status: "active" | "inactive";
                    metadata: any;
                    price: string;
                    discount: string | null;
                    productId: number | null;
                    sku: string;
                    stock: number;
                    isDefault: boolean | null;
                    product: {
                        id: number;
                        name: string;
                    } | null;
                    variantValues: {
                        variantId: number;
                        attributeValueId: number;
                        value: {
                            id: number;
                            value: string;
                            metadata: unknown;
                            attributeId: number;
                        };
                    }[];
                };
            }[];
            lastPayment: {
                id: number;
                createdAt: Date;
                status: "pending" | "success" | "failed";
                orderId: number;
                amount: string;
                method: string | null;
                paymentDate: Date | null;
            } | null;
        } | undefined;
        meta: object;
    }>;
    updateStatus: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: number;
            status: "pending" | "shipping" | "delivered" | "cancelled";
        };
        output: {
            success: boolean;
            message: string;
        };
        meta: object;
    }>;
    cancelOrder: import("@trpc/server").TRPCMutationProcedure<{
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
export type SearchOrdersOutput = inferProcedureOutput<typeof ordersRoute.searchOrders>;
