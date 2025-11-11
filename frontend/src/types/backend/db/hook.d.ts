export declare function updateProductVariantsAggregateHook(productId: number): Promise<void>;
export declare function useVoucherHook(voucherId: number): Promise<{
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
} | undefined>;
