import crypto from "crypto";

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

export class VnpaySDK {
  private config: VnpayConfig;

  constructor(config: VnpayConfig) {
    this.config = config;
  }

  private sortObject(obj: Record<string, any>): Record<string, any> {
    const sorted: Record<string, any> = {};
    const keys = Object.keys(obj).sort();
    for (const k of keys) sorted[k] = obj[k];
    return sorted;
  }

  private createSecureHash(signData: string): string {
    return crypto
      .createHmac("sha512", this.config.hashSecret)
      .update(Buffer.from(signData, "utf-8"))
      .digest("hex");
  }

  createPayment(params: CreatePaymentParams): string {
    const date = new Date();
    const offset = 7 * 60; // GMT+7
    const local = new Date(date.getTime() + offset * 60000);
    const pad = (n: number) => (n < 10 ? "0" + n : n);
  
    const createDate = `${local.getFullYear()}${pad(local.getMonth() + 1)}${pad(
      local.getDate()
    )}${pad(local.getHours())}${pad(local.getMinutes())}${pad(local.getSeconds())}`;
    const expire = new Date(local.getTime() + 15 * 60 * 1000);
    const expireDate = `${expire.getFullYear()}${pad(expire.getMonth() + 1)}${pad(
      expire.getDate()
    )}${pad(expire.getHours())}${pad(expire.getMinutes())}${pad(expire.getSeconds())}`;
  
    const orderId = params.orderId ?? local.getTime().toString().slice(-8);
  
    const vnp_Params: Record<string, any> = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: this.config.tmnCode,
      vnp_Amount: params.amount * 100,
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderId,
      vnp_OrderInfo: params.orderInfo, // Giữ nguyên, không lọc ký tự
      vnp_OrderType: "other",
      vnp_Locale: params.locale ?? "vn",
      vnp_ReturnUrl: this.config.returnUrl,
      vnp_IpAddr: params.ipAddr,
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate,
    };
  
    if (params.bankCode) vnp_Params["vnp_BankCode"] = params.bankCode;
  
    const sortedParams = this.sortObject(vnp_Params);
    const signData = Object.entries(sortedParams)
      .map(([k, v]) => `${k}=${v}`)
      .join("&");
  
    const secureHash = this.createSecureHash(signData);
    sortedParams["vnp_SecureHash"] = secureHash;
  
    const finalUrl =
      this.config.vnpUrl +
      "?" +
      Object.entries(sortedParams)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join("&");
  
    console.log("SignData:", signData);
    console.log("Hash:", secureHash);
    return finalUrl;
  }
  

  validateCallback(query: Record<string, any>): ValidateCallbackResult {
    const receivedHash = query["vnp_SecureHash"];
    delete query["vnp_SecureHash"];
    delete query["vnp_SecureHashType"];

    const sorted = this.sortObject(query);
    const signData = Object.entries(sorted)
      .map(([k, v]) => `${k}=${v}`)
      .join("&");

    const expectedHash = this.createSecureHash(signData);
    const isValid = expectedHash === receivedHash;

    return {
      isValid,
      code: isValid ? query["vnp_ResponseCode"] || "00" : "97",
      message: isValid ? "Checksum OK" : "Checksum failed",
    };
  }
}
