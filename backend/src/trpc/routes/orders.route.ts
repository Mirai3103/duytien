import z from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import db from "@/db";
import {
  cartItems as cartItemsTable,
  orders as ordersTable,
  orderItems as orderItemsTable,
  payments as paymentsTable,
} from "@/db/schema";
import { desc, eq, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
const createOrderSchema = z.object({
  cartItems: z.array(z.number()),
  shippingAddressId: z.number(),
  note: z.string().optional(),
  paymentMethod: z.enum(["cod", "vnpay", "momo"]),
  voucherId: z.number().optional(),
});
export const ordersRoute = router({
  createOrder: protectedProcedure
    .input(createOrderSchema)
    .mutation(async ({ ctx, input }) => {
      await db.transaction(async (tx) => {
        // get cart items
        const cartItems = await tx.query.cartItems.findMany({
          where: inArray(cartItemsTable.id, input.cartItems),
          with: {
            variant: true,
          },
        });
        if (cartItems.length !== input.cartItems.length) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Some cart items not found",
          });
        }
        // calculate total amount
        const totalAmount = cartItems.reduce(
          (acc, item) =>
            acc + Number(item.variant.price) * Number(item.quantity),
          0
        );
        // create order
        const [order] = await tx
          .insert(ordersTable)
          .values({
            userId: ctx.session!.session.userId,
            paymentMethod: input.paymentMethod,
            totalAmount: totalAmount.toString(),
            createdAt: new Date(),
            deliveryAddressId: input.shippingAddressId,
            status: "pending",
            voucherId: input.voucherId, // TODO: add voucher
          })
          .returning();
        // create order items
        await tx.insert(orderItemsTable).values(
          cartItems.map((item) => ({
            orderId: order!.id,
            variantId: item.variantId,
            quantity: item.quantity,
            price: (
              Number(item.variant.price) * Number(item.quantity)
            ).toString(),
          }))
        );
        // create payment
        await tx.insert(paymentsTable).values({
          orderId: order!.id,
          amount: totalAmount.toString(),
          method: input.paymentMethod,
          status: "pending",
          createdAt: new Date(),
        });
        // update cart items
        await tx
          .delete(cartItemsTable)
          .where(inArray(cartItemsTable.id, input.cartItems));
        // return order id
        return order!.id;
      });
      return {
        success: true,
        message: "Order created successfully",
      };
    }),
  getOrders: protectedProcedure
    .input(
      z.object({
        page: z.number().optional(),
        limit: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const orders = await db.query.orders.findMany({
        where: eq(ordersTable.userId, ctx.session!.session.userId),
        with: {
          items: {
            with: {
              variant: true,
            },
          },
          payments: true,
        },
        limit: input.limit ?? 10,
        offset: (input.page ?? 1 - 1) * (input.limit ?? 10),
        orderBy: [desc(ordersTable.createdAt)],
      });
      return {
        orders,
        total: orders.length,
        page: input.page ?? 1,
        limit: input.limit ?? 10,
      };
    }),
});
