export type CreateOrderInput = {
    cartItems: number[];
    shippingAddressId: number;
    note?: string;
    paymentMethod: "cod" | "vnpay" | "momo";
    voucherId?: number;
    userId: string;
    installmentCount?: number;
    payType?: "full" | "partial";
    identityId?: string;
    fullName?: string;
};
export declare function createOrderService(input: CreateOrderInput): Promise<{
    success: boolean;
    message: string;
    redirectUrl: string;
}>;
