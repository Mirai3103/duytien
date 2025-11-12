import db from "@/db";
import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { momoSdk, verifyPayment } from "@/services/payment";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { payments as paymentsTable } from "@/db/schema";
// partnerCode=MOMO&orderId=ORD-251111-B98B&requestId=ORD-251111-B98B&amount=17942000&orderInfo=Đơn+hàng+ORD-251111-B98B&orderType=momo_wallet&transId=4610849895&resultCode=0&message=Thành+công.&payType=qr&responseTime=1762884809397&extraData=&signature=f03a51ba4d0c85471920036aa6e3ef0ec9993ef01ca23f46ee5405241c8a51d6
const callbackSchema = z.object({
  momo: z
    .any()
    .optional(),
  vnpay: z
    .any()
    .optional(),
});
export const paymentRoute = router({
  callback: publicProcedure
    .input(callbackSchema)
    .mutation(async ({ input }) => {
      if(!input.momo && !input.vnpay) {
        return {
          success: false,
          message: "Invalid callback",
          payment: null,
        };
      }
      const result = verifyPayment({ args: input.momo || input.vnpay!, method: input.momo ? "momo" : "vnpay" });
      if (!result.success) {
        return {
          success: false,
          message: "Invalid callback",
          payment: null,
        };
      }
      const id = result.id;
      const payment = await db.query.payments.findFirst({
        where: eq(paymentsTable.id, Number(id)),
      });
      const isSuccess = result.isSuccess;

      if (!payment) {
        return {
          success: false,
          message: "Không tìm thấy thanh toán",
          payment: null,
        };
      }
      await db
        .update(paymentsTable)
        .set({
          status: isSuccess ? "success" : "failed",
        })
        .where(eq(paymentsTable.id, Number(id)));
      return {
        success: true,
        isPaymentSuccess: isSuccess,
        message: isSuccess ? "Chúc mừng bạn đã thanh toán thành công" : "Thanh toán thất bại",
        payment,
      };
    }),
});
