import db from "@/db";
import {
  cartItems as cartItemsTable,
  orders as ordersTable,
  orderItems as orderItemsTable,
  payments as paymentsTable,
  user as usersTable,
  vouchers as vouchersTable,
  productVariants as productVariantsTable,
} from "@/db/schema";
import {
  and,
  asc,
  between,
  count,
  desc,
  eq,
  ilike,
  inArray,
  or,
  sql,
  SQL,
} from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { alias } from "drizzle-orm/pg-core";
import { getFinalPrice } from "@/utils/utils";
import { getVoucherReducePrice } from "@/services/vouchers";
import { createPayment } from "@/services/payment";
import { generateOrderCode } from "@/utils/gen_order_code";
import { useVoucherHook } from "@/db/hook";
import { updateVariantStock } from "./orders";
import dayjs from "dayjs";

// Types
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


export async function createOrderService(input: CreateOrderInput) {
    let paymentAmount = 0;
    let orderCode = "";
    let paymentId = 0;
  
    await db.transaction(async (tx) => {
      // Get cart items
      const cartItems = await tx.query.cartItems.findMany({
        where: inArray(cartItemsTable.id, input.cartItems),
        with: {
          variant: {
            with: {
              product: {
                columns: {
                  id: true,
                  discount: true,
                },
              },
            },
          },
        },
      });
  
      if (cartItems.length !== input.cartItems.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Some cart items not found",
        });
      }
  
      // Calculate total amount
      const totalAmount = cartItems.reduce(
        (acc, item) =>
          acc +
          getFinalPrice(
            Number(item.variant.price),
            Number(item.variant.product?.discount || 0)
          ) *
            Number(item.quantity),
        0
      );
  
      // Apply voucher discount
      const voucher = input.voucherId
        ? await tx.query.vouchers.findFirst({
            where: eq(vouchersTable.id, input.voucherId),
          })
        : null;
  
      const reducePrice = voucher
        ? getVoucherReducePrice(
            totalAmount,
            Number(voucher.discount || 0),
            Number(voucher.maxDiscount || null),
            voucher.type!
          )
        : 0;
  
      const finalTotalAmount = totalAmount - reducePrice;
      const payType = input.payType || "full";
  
      // Calculate installment details if partial payment
      let installmentAmount = finalTotalAmount;
      let nextPayDay: Date | undefined = undefined;
      let remainingInstallments: number | undefined = undefined;
      let totalPaidAmount: number | undefined = undefined;
  
      if (payType === "partial" && input.installmentCount && input.installmentCount > 1) {
        // Validate installmentCount
        if (!input.identityId || !input.fullName) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Identity ID and Full Name are required for installment payment",
          });
        }
  
        // Calculate installment amount and round up to nearest 1000
        const rawInstallmentAmount = finalTotalAmount / input.installmentCount;
        installmentAmount = Math.ceil(rawInstallmentAmount / 1000) * 1000;
        
        nextPayDay = dayjs().add(1, "month").toDate();
        remainingInstallments = input.installmentCount - 1; // Minus first payment
        totalPaidAmount = installmentAmount;
      }
  
      // Create order
      const [order] = await tx
        .insert(ordersTable)
        .values({
          userId: input.userId,
          paymentMethod: input.paymentMethod,
          totalAmount: finalTotalAmount.toString(),
          createdAt: new Date(),
          deliveryAddressId: input.shippingAddressId,
          status: "pending",
          voucherId: input.voucherId,
          totalItems: cartItems.length,
          code: generateOrderCode(new Date()),
          payType: payType,
          identityId: input.identityId,
          full_name: input.fullName,
          nextPayDay: nextPayDay,
          nextPayAmount: payType === "partial" ? installmentAmount.toString() : undefined,
          installmentCount: payType === "partial" ? input.installmentCount : undefined,
          remainingInstallments: payType === "partial" ? remainingInstallments : undefined,
          totalPaidAmount: payType === "partial" ? totalPaidAmount?.toString() : undefined,
        })
        .returning();
  
      // Use installment amount for partial payment, otherwise use total amount
      paymentAmount = payType === "partial" ? installmentAmount : Number(order!.totalAmount);
      orderCode = order!.code!;
  
      // Create order items
      await tx.insert(orderItemsTable).values(
        cartItems.map((item) => ({
          orderId: order!.id,
          variantId: item.variantId,
          quantity: item.quantity,
          price: (
            getFinalPrice(
              Number(item.variant.price),
              Number(item.variant.product?.discount || 0)
            ) * Number(item.quantity)
          ).toString(),
        }))
      );
  
      // Subtract stock immediately when order is created
      for (const item of cartItems) {
        await updateVariantStock(tx, item.variantId, item.quantity, "subtract");
      }
  
      // Create payment - for partial payment, only charge the first installment
      const [payment] = await tx
        .insert(paymentsTable)
        .values({
          orderId: order!.id,
          amount: paymentAmount.toString(),
          method: input.paymentMethod,
          status: "pending",
          createdAt: new Date(),
        })
        .returning();
  
      paymentId = payment?.id!;
  
      await tx
        .update(ordersTable)
        .set({
          lastPaymentId: payment!.id,
        })
        .where(eq(ordersTable.id, order!.id));
  
      // Delete cart items
      await tx
        .delete(cartItemsTable)
        .where(inArray(cartItemsTable.id, input.cartItems));
  
      // Use voucher
      if (order?.voucherId) {
        useVoucherHook(order?.voucherId);
      }
    });
  
    // Generate payment URL if not COD
    let redirectUrl = "";
    console.log("paymentMethod", input.paymentMethod);
    if (input.paymentMethod !== "cod") {
      const payment = await createPayment({
        amount: paymentAmount,
        orderInfo: "Đơn hàng " + orderCode,
        id: paymentId.toString(),
        method: input.paymentMethod as "momo" | "vnpay",
      });
      redirectUrl = payment;
    }
    console.log("redirectUrl", redirectUrl);
  
    return {
      success: true,
      message: "Order created successfully",
      redirectUrl,
    };
  }
  