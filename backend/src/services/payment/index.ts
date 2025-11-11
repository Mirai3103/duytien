import { MomoSDK } from "./momo.sdk";

export const momoSdk = new MomoSDK({
  partnerCode: "MOMO",
  accessKey: "F8BBA842ECF85",
  secretKey: "K951B6PE1waDMi640xX08PD3vg6EkVlz",
  redirectUrl: process.env.MOMO_REDIRECT_URL!,
  ipnUrl: process.env.MOMO_IPN_URL!,
});
import { VnpaySDK } from "./vnpay.sdk";

export const vnpaySdk = new VnpaySDK({
  tmnCode: "U90TT9KS",
  hashSecret: "9Z6E78DEUXRCJG2OA597K10758WK0I8G",
  vnpUrl: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  returnUrl: "http://localhost:8888/order/vnpay_return",
});
// async function test() {
//   const payment =  vnpaySdk.createPayment({
//     amount: 100000,
//     ipAddr: "26.160.38.50",
//     orderInfo: "Test payment",
//     locale: "vn",
//     orderId: "1234567890",
//   });
//   console.log("Pay URL:", payment);
// }
// test();
// // 1️⃣ Tạo thanh toán
// (async () => {
//   const payment = await momo.createPayment({
//     amount: 50000,
//     orderInfo: "Test payment",
//   });
//   console.log("Pay URL:", payment.payUrl);
// })();
