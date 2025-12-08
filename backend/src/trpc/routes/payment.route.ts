import db from "@/db";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";
import { createPayment, momoSdk, verifyPayment } from "@/services/payment";
import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import { orders as ordersTable, payments as paymentsTable } from "@/db/schema";
import dayjs from "dayjs";
// partnerCode=MOMO&orderId=ORD-251111-B98B&requestId=ORD-251111-B98B&amount=17942000&orderInfo=Đơn+hàng+ORD-251111-B98B&orderType=momo_wallet&transId=4610849895&resultCode=0&message=Thành+công.&payType=qr&responseTime=1762884809397&extraData=&signature=f03a51ba4d0c85471920036aa6e3ef0ec9993ef01ca23f46ee5405241c8a51d6
const callbackSchema = z.object({
  momo: z.any().optional(),
  vnpay: z.any().optional(),
});
export const paymentRoute = router({
  callback: publicProcedure
    .input(callbackSchema)
    .mutation(async ({ input }) => {
      if (!input.momo && !input.vnpay) {
        return {
          success: false,
          message: "Invalid callback",
          payment: null,
        };
      }
      const result = verifyPayment({
        args: input.momo || input.vnpay!,
        method: input.momo ? "momo" : "vnpay",
      });
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
        with: {
          order: true,
        },
      });
      const isSuccess = result.isSuccess;

      if (!payment) {
        return {
          success: false,
          message: "Không tìm thấy thanh toán",
          payment: null,
        };
      }
      
      // Update payment status
      await db
        .update(paymentsTable)
        .set({
          status: isSuccess ? "success" : "failed",
        })
        .where(eq(paymentsTable.id, Number(id)));

      // Handle installment payment success
      if (isSuccess && payment.order && payment.order.payType === "partial") {
        const order = payment.order;
        const remainingInstallments = (order.remainingInstallments || 0) - 1;
        const totalPaidAmount = Number(order.totalPaidAmount || 0) + Number(payment.amount);
        
        // Calculate next payment day (1 month from current nextPayDay)
        const nextPayDay = remainingInstallments > 0 
          ? dayjs(order.nextPayDay).add(1, "month").toDate()
          : null;

        await db
          .update(ordersTable)
          .set({
            remainingInstallments: remainingInstallments,
            totalPaidAmount: totalPaidAmount.toString(),
            nextPayDay: nextPayDay,
          })
          .where(eq(ordersTable.id, order.id));
      }

      return {
        success: true,
        isPaymentSuccess: isSuccess,
        message: isSuccess
          ? "Chúc mừng bạn đã thanh toán thành công"
          : "Thanh toán thất bại",
        payment,
      };
    }),

  createPayment: publicProcedure
    .input(
      z.object({
        orderId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const order = await db.query.orders.findFirst({
        where: eq(ordersTable.id, Number(input.orderId)),
        with: {
          lastPayment: true,
        },
      });
      if (!order) {
        return {
          success: false,
          message: "Order not found",
          payment: null,
        };
      }
      if (order.lastPayment && order.lastPayment.status === "success") {
        return {
          success: false,
          message: "Order already has a successful payment",
          payment: null,
        };
      }
      const [newPayment] = await db
        .insert(paymentsTable)
        .values({
          orderId: order.id,
          method: order.paymentMethod as "momo" | "vnpay",
          status: "pending",
          paymentDate: new Date(),
          createdAt: new Date(),
          amount: order.totalAmount.toString(),
        })
        .returning();
      const payment = await createPayment({
        amount: Number(order.totalAmount),
        orderInfo: "Đơn hàng " + order.code,
        id: newPayment!.id.toString(),
        method: order.paymentMethod as "momo" | "vnpay",
      });
      await db
        .update(ordersTable)
        .set({
          lastPaymentId: newPayment!.id,
        })
        .where(eq(ordersTable.id, order.id));
      return {
        success: true,
        message: "Payment created successfully",
        redirectUrl: payment,
      };
    }),

    setOrderPaymentStatus: protectedProcedure
    .input(z.object({
      orderId: z.number(),
      status: z.enum(["success", "failed", "pending"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const order = await db.query.orders.findFirst({
        where: eq(ordersTable.id, input.orderId),
        with: {
          lastPayment: true,
        },
      });
      if (!order) {
        return {
          success: false,
          message: "Order not found",
        };
      }
      if (!order.lastPayment) {
        return {
          success: false,
          message: "Order has no last payment record",
        };
      }
      await db.update(paymentsTable).set({ status: input.status }).where(eq(paymentsTable.id, order.lastPayment!.id));
      return {
        success: true,
        message: "Order payment status updated successfully",
      };
    }),

    createInstallmentPayment: protectedProcedure
    .input(z.object({
      orderId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const order = await db.query.orders.findFirst({
        where: eq(ordersTable.id, input.orderId),
      });

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      if (order.payType !== "partial") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Order is not an installment order",
        });
      }

      if (!order.remainingInstallments || order.remainingInstallments <= 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No remaining installments to pay",
        });
      }

      // Create new payment for this installment
      const [newPayment] = await db
        .insert(paymentsTable)
        .values({
          orderId: order.id,
          method: order.paymentMethod as "momo" | "vnpay",
          status: "pending",
          paymentDate: new Date(),
          createdAt: new Date(),
          amount: order.nextPayAmount?.toString() || "0",
        })
        .returning();

      // Create payment URL
      const paymentUrl = await createPayment({
        amount: Number(order.nextPayAmount || 0),
        orderInfo: `Trả góp kỳ ${(order.installmentCount || 0) - order.remainingInstallments + 1} - Đơn hàng ${order.code}`,
        id: newPayment!.id.toString(),
        method: order.paymentMethod as "momo" | "vnpay",
      });

      // Update order's last payment ID
      await db
        .update(ordersTable)
        .set({
          lastPaymentId: newPayment!.id,
        })
        .where(eq(ordersTable.id, order.id));

      return {
        success: true,
        message: "Installment payment created successfully",
        redirectUrl: paymentUrl,
      };
    }), 
});
