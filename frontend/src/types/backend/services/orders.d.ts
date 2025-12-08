export type GetOrdersInput = {
    userId: string;
    page?: number;
    limit?: number;
};
export type SearchOrdersInput = {
    page?: number;
    limit?: number;
    search?: string;
    status?: ("pending" | "shipping" | "delivered" | "cancelled")[];
    paymentMethod?: "cod" | "vnpay" | "momo" | "all";
    paymentStatus?: "pending" | "success" | "failed";
    dateRange?: {
        from: Date;
        to: Date;
    } | null;
    orderBy?: "createdAt" | "totalAmount";
    orderDirection?: "asc" | "desc";
};
export type UpdateOrderStatusInput = {
    id: number;
    status: "pending" | "shipping" | "delivered" | "cancelled";
};
export declare function updateVariantStock(tx: any, variantId: number, quantity: number, operation: "subtract" | "add"): Promise<void>;
export declare function getUserOrders(input: GetOrdersInput): Promise<{
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
}>;
export declare function getOrderStatusStats(): Promise<{
    statusStats: {
        status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
        count: number;
    }[];
    totalOrders: number;
}>;
export declare function searchOrders(input: SearchOrdersInput): Promise<{
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
}>;
export declare function getOrderById(orderId: number): Promise<{
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
} | undefined>;
export declare function updateOrderStatus(input: UpdateOrderStatusInput): Promise<{
    success: boolean;
    message: string;
}>;
export declare function cancelOrder(orderId: number): Promise<{
    success: boolean;
    message: string;
}>;
