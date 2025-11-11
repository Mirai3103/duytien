export interface VnpayConfig {
    tmnCode: string;
    hashSecret: string;
    vnpUrl: string;
    returnUrl: string;
}
export interface CreatePaymentParams {
    amount: number;
    orderId?: string;
    orderInfo: string;
    bankCode?: string;
    locale?: "vn" | "en";
    ipAddr: string;
}
export interface ValidateCallbackResult {
    isValid: boolean;
    code: string;
    message: string;
}
export declare class VnpaySDK {
    private config;
    constructor(config: VnpayConfig);
    private sortObject;
    private createSecureHash;
    createPayment(params: CreatePaymentParams): string;
    validateCallback(query: Record<string, any>): ValidateCallbackResult;
}
