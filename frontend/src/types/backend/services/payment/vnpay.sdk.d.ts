export interface VnpayConfig {
    tmnCode: string;
    hashSecret: string;
    returnUrl: string;
    vnpUrl?: string;
}
export interface CreatePaymentParams {
    amount: number;
    orderInfo: string;
    orderType?: string;
    bankCode?: string;
    locale?: "vn" | "en";
    ipAddr?: string;
    txnRef?: string;
    expireMinutes?: number;
}
export interface VerifyReturnResult {
    isValid: boolean;
    message: string;
    responseCode?: string;
    transactionStatus?: string;
    data?: Record<string, any>;
}
export declare class VnpaySDK {
    private config;
    constructor(config: VnpayConfig);
    private phpUrlEncode;
    private hmacSHA512;
    createPayment(params: CreatePaymentParams): string;
    verifyReturn(query: Record<string, string>): VerifyReturnResult;
}
