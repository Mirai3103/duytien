import { MomoSDK } from "./momo.sdk";
export declare const momoSdk: MomoSDK;
import { VnpaySDK } from "./vnpay.sdk";
export declare const vnpaySdk: VnpaySDK;
interface CreatePaymentParams {
    id: string;
    amount: number;
    orderInfo: string;
    method: "momo" | "vnpay";
}
export declare function createPayment({ id, amount, orderInfo, method, }: CreatePaymentParams): Promise<string>;
interface VerifyPaymentParams {
    args: Record<string, any>;
    method: "momo" | "vnpay";
}
export declare function verifyPayment({ args, method }: VerifyPaymentParams): {
    success: boolean;
    isSuccess: boolean;
    id: any;
};
export {};
