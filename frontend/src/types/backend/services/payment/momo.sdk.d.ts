export interface MomoConfig {
    partnerCode: string;
    accessKey: string;
    secretKey: string;
    redirectUrl: string;
    ipnUrl: string;
    endpoint?: string;
}
export interface CreatePaymentParams {
    amount: number;
    orderInfo: string;
    orderId?: string;
    requestId?: string;
    extraData?: Record<string, any>;
    lang?: "vi" | "en";
    autoCapture?: boolean;
}
export interface MomoPaymentResponse {
    partnerCode: string;
    requestId: string;
    orderId: string;
    amount: number;
    responseTime: number;
    message: string;
    resultCode: number;
    payUrl?: string;
    deeplink?: string;
    qrCodeUrl?: string;
    [key: string]: any;
}
export declare class MomoSDK {
    private config;
    constructor(config: MomoConfig);
    private hmacSHA256;
    createPayment(params: CreatePaymentParams): Promise<MomoPaymentResponse>;
    validateCallback(data: Record<string, any>): boolean;
}
