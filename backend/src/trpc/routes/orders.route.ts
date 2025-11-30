import z from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
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
  type SQLWrapper,
} from "drizzle-orm";
import { TRPCError, type inferProcedureOutput } from "@trpc/server";
import { alias } from "drizzle-orm/pg-core";
import { getFinalPrice, getReducePrice } from "@/utils/utils";
import { getVoucherReducePrice } from "@/services/vouchers";
import { createPayment, momoSdk } from "@/services/payment";
import { generateOrderCode } from "@/utils/gen_order_code";
import { useVoucherHook } from "@/db/hook";

// Helper function to update product variant stock
async function updateVariantStock(
  tx: any,
  variantId: number,
  quantity: number,
  operation: "subtract" | "add"
) {
  console.log("updateVariantStock", variantId, quantity, operation);
  if (operation === "subtract") {
    await tx
      .update(productVariantsTable)
      .set({
        stock: sql`${productVariantsTable.stock} - ${quantity}`,
      })
      .where(eq(productVariantsTable.id, variantId));
  } else {
    
    await tx
      .update(productVariantsTable)
      .set({
        stock: sql`${productVariantsTable.stock} + ${quantity}`,
      })
      .where(eq(productVariantsTable.id, variantId));
  }
}

const createOrderSchema = z.object({
  cartItems: z.array(z.number()),
  shippingAddressId: z.number(),
  note: z.string().optional(),
  paymentMethod: z.enum(["cod", "vnpay", "momo"]),
  voucherId: z.number().optional(),
});

const searchOrdersSchema = z.object({
  page: z.number().optional().default(1),
  limit: z.number().optional().default(20),
  search: z.string().optional(), // search by order id, user id, user email, user name, user phone, user address, user city, user state, user zip, user country
  status: z
    .array(z.enum(["pending", "shipping", "delivered", "cancelled"]))
    .optional(),
  paymentMethod: z
    .enum(["cod", "vnpay", "momo", "all"])
    .optional()
    .transform((val) => (val?.toLowerCase() == "all" ? undefined : val)),
  paymentStatus: z.enum(["pending", "success", "failed"]).optional(),
  dateRange: z
    .object({
      from: z
        .date()
        .optional()
        .default(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
      to: z.date().optional().default(new Date()),
    })
    .optional()
    .nullable()
    .default(null),
  orderBy: z.enum(["createdAt", "totalAmount"]).optional(),
  orderDirection: z.enum(["asc", "desc"]).optional(),
});
export const ordersRoute = router({
  createOrder: protectedProcedure
    .input(createOrderSchema)
    .mutation(async ({ ctx, input }) => {
      let paymentAmount = 0;
      let orderCode = "";
      let paymentId = 0;
      await db
        .transaction(async (tx) => {
          // get cart items
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
          // calculate total amount
          const totalAmount = cartItems.reduce(
            (acc, item) =>
              acc + getFinalPrice(Number(item.variant.price), Number(item.variant.product?.discount || 0)) * Number(item.quantity),
            0
          );
          const voucher = input.voucherId ? await tx.query.vouchers.findFirst({
            where: eq(vouchersTable.id, input.voucherId),
          }) : null;
          const reducePrice = voucher ? getVoucherReducePrice(totalAmount, Number(voucher.discount || 0), Number(voucher.maxDiscount || null), voucher.type!) : 0;
          // create order
          const [order] = await tx
            .insert(ordersTable)
            .values({
              userId: ctx.session!.session.userId,
              paymentMethod: input.paymentMethod,
              totalAmount: (totalAmount - reducePrice).toString(),
              createdAt: new Date(),
              deliveryAddressId: input.shippingAddressId,
              status: "pending",
              voucherId: input.voucherId, 
              totalItems: cartItems.length,
              code: generateOrderCode(new Date()),
              
            })
            .returning();
          paymentAmount = Number(order!.totalAmount);
          orderCode = order!.code!;
          // create order items
          await tx.insert(orderItemsTable).values(
            cartItems.map((item) => ({
              orderId: order!.id,
              variantId: item.variantId,
              quantity: item.quantity,
              price: (
                getFinalPrice(Number(item.variant.price), Number(item.variant.product?.discount || 0)) * Number(item.quantity)
              ).toString(),
            }))
          );
          
          // subtract stock immediately when order is created
          for (const item of cartItems) {
            await updateVariantStock(tx, item.variantId, item.quantity, "subtract");
          }
          
          // create payment
        const [payment] = await tx.insert(paymentsTable).values({
            orderId: order!.id,
            amount: order!.totalAmount,
            method: input.paymentMethod,
            status: "pending",
            createdAt: new Date(),
          }).returning();
          paymentId = payment?.id!;
          await tx.update(ordersTable).set({
            lastPaymentId: payment!.id,
          }).where(eq(ordersTable.id, order!.id));
          // update cart items
          await tx
            .delete(cartItemsTable)
            .where(inArray(cartItemsTable.id, input.cartItems));
          // return order id
          if(order?.voucherId){
            useVoucherHook(order?.voucherId);
          }
          return order!.id;
        })
      let redirectUrl = "";
      console.log("paymentMethod", input.paymentMethod);
      if(input.paymentMethod !== "cod") {
        const payment = await createPayment({
          amount: paymentAmount,
          orderInfo: "Đơn hàng " + orderCode,
          id:paymentId.toString(),
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
    }),
  getOrders: protectedProcedure
    .input(
      z.object({
        page: z.number().optional().default(1),
        limit: z.number().optional().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const page = input.page ?? 1;
      const limit = input.limit ?? 10;
      const offset = (page - 1) * limit;

      // Get total count
      const totalCount = await db.$count(
        ordersTable,
        eq(ordersTable.userId, ctx.session!.session.userId)
      );

      const orders = await db.query.orders.findMany({
        where: eq(ordersTable.userId, ctx.session!.session.userId),
        with: {
          items: {
            with: {
              variant: {
                with: {
                  product: true,
                  variantValues: {
                    with: {
                      value: true,
                    },
                  },
                },
              },
            },
          },
          lastPayment: true,
          voucher: true,
        },
        limit,
        offset,
        orderBy: [desc(ordersTable.createdAt)],
      });

      return {
        orders,
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      };
    }),

  getStatusStats: protectedProcedure.query(async ({ ctx }) => {
    const stats = await db
      .select({
        status: ordersTable.status,
        count: count(ordersTable.id),
      })
      .from(ordersTable)
      .groupBy(ordersTable.status);
    const totalCount = await db.$count(ordersTable);
    return {
      statusStats: stats.map((stat) => ({
        status: stat.status,
        count: stat.count,
      })),
      totalOrders: totalCount,
    };
  }),
  searchOrders: protectedProcedure // for admin
    .input(searchOrdersSchema)
    .query(async ({ input }) => {
      const userTableAlias = alias(usersTable, "u_table");
      const page = input.page ?? 1;
      const limit = input.limit ?? 20;
      const offset = (page - 1) * limit;

      // Bước 1: Tìm danh sách userIds nếu có từ khóa search
      let userIds: string[] = [];
      if (input.search) {
        const users = await db
          .select({ id: userTableAlias.id })
          .from(userTableAlias)
          .where(
            or(
              ilike(userTableAlias.email, `%${input.search}%`),
              ilike(userTableAlias.name, `%${input.search}%`),
              ilike(userTableAlias.phone, `%${input.search}%`)
            )
          );
        userIds = users.map((u) => u.id);
      }

      // Bước 2: Xây dựng query động
      const qb = db
        .select()
        .from(ordersTable)
        .leftJoin(userTableAlias, eq(userTableAlias.id, ordersTable.userId))
        .leftJoin(
          paymentsTable,
          eq(paymentsTable.id, ordersTable.lastPaymentId)
        )
        .leftJoin(vouchersTable, eq(vouchersTable.id, ordersTable.voucherId))
        .$dynamic();

      // Bước 3: Điều kiện WHERE
      const conditions: SQL[] = [];

      if (input.search) {
        const orConditions = [
          ilike(ordersTable.code, `%${input.search}%`),
          userIds.length > 0 ? inArray(ordersTable.userId, userIds) : undefined,
        ].filter(Boolean) as SQL[];
        conditions.push(or(...orConditions) as SQL);
      }

      if (input.status && input.status.length > 0) {
        conditions.push(inArray(ordersTable.status, input.status));
      }

      if (input.paymentMethod) {
        conditions.push(
          eq(ordersTable.paymentMethod, input.paymentMethod as any)
        );
      }

      if (input.paymentStatus) {
        conditions.push(eq(paymentsTable.status, input.paymentStatus));
      }

      if (input.dateRange) {
        conditions.push(
          between(
            ordersTable.createdAt,
            input.dateRange.from!,
            input.dateRange.to!
          )
        );
      }

      // Bước 4: ORDER BY
      let orderBy;
      if (input.orderBy === "totalAmount") {
        orderBy =
          input.orderDirection === "asc"
            ? asc(ordersTable.totalAmount)
            : desc(ordersTable.totalAmount);
      } else if (input.orderBy === "createdAt") {
        orderBy =
          input.orderDirection === "asc"
            ? asc(ordersTable.createdAt)
            : desc(ordersTable.createdAt);
      } else {
        orderBy = desc(ordersTable.createdAt);
      }

      // Bước 5: Thực thi query
      const res = await qb
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset);

      // Bước 6: Đếm tổng số bản ghi
      const totalCount = await db.$count(
        ordersTable,
        conditions.length > 0 ? and(...conditions) : undefined
      );

      return {
        orders: res,
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      };
    }),
  getOrder: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const order = await db.query.orders.findFirst({
        where: eq(ordersTable.id, input.id),
        with: {
          user: true,
          lastPayment: true,
          voucher: true,
          items: {
            with: {
              variant: {
                with: {
                  product: {
                    columns: {
                      id: true,
                      name: true,
                    },
                  },
                  variantValues: {
                    with: {
                      value: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      return order;
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "shipping", "delivered", "cancelled"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newStatus = input.status;

      // Update order status
      await db
        .update(ordersTable)
        .set({ status: newStatus })
        .where(eq(ordersTable.id, input.id));

      // Add stock back when order is cancelled (stock was already subtracted when order was created)
      if (newStatus === "cancelled") {
        const order = await db.query.orders.findFirst({
          where: eq(ordersTable.id, input.id),
          with: {
            items: {
              columns: {
                variantId: true,
                quantity: true,
              },
            },
          },
        });

        if (order) {
          for (const item of order.items) {
            await updateVariantStock(db, item.variantId, item.quantity, "add");
          }
        }
      }

      return {
        success: true,
        message: "Order status updated successfully",
      };
    }),
    cancelOrder: protectedProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Get order items before cancelling
      const order = await db.query.orders.findFirst({
        where: eq(ordersTable.id, input.id),
        with: {
          items: {
            columns: {
              variantId: true,
              quantity: true,
            },
          },
        },
      });

      // Update order status to cancelled
      await db.update(ordersTable).set({ status: "cancelled" }).where(eq(ordersTable.id, input.id));

      // Add stock back
      if (order) {
        for (const item of order.items) {
          await updateVariantStock(db, item.variantId, item.quantity, "add");
        }
      }

      return {
        success: true,
        message: "Hủy đơn hàng thành công",
      };
    }),
});

export type SearchOrdersOutput = inferProcedureOutput<
  typeof ordersRoute.searchOrders
>;
