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

export type GetOrdersInput = {
  userId: string;
  page?: number;
  limit?: number;
};

export type SearchOrdersInput = {
  page?: number;
  limit?: number;
  search?: string;
  status?: ("pending" | "shipping" | "delivered" | "cancelled")[];
  paymentMethod?: "cod" | "vnpay" | "momo" | "all";
  paymentStatus?: "pending" | "success" | "failed";
  dateRange?: {
    from: Date;
    to: Date;
  } | null;
  orderBy?: "createdAt" | "totalAmount";
  orderDirection?: "asc" | "desc";
};

export type UpdateOrderStatusInput = {
  id: number;
  status: "pending" | "shipping" | "delivered" | "cancelled";
};

// Helper function to update product variant stock
export async function updateVariantStock(
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

// Create order service
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

    // Create order
    const [order] = await tx
      .insert(ordersTable)
      .values({
        userId: input.userId,
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

    // Create payment
    const [payment] = await tx
      .insert(paymentsTable)
      .values({
        orderId: order!.id,
        amount: order!.totalAmount,
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

// Get user orders with pagination
export async function getUserOrders(input: GetOrdersInput) {
  const page = input.page ?? 1;
  const limit = input.limit ?? 10;
  const offset = (page - 1) * limit;

  // Get total count
  const totalCount = await db.$count(
    ordersTable,
    eq(ordersTable.userId, input.userId)
  );

  const orders = await db.query.orders.findMany({
    where: eq(ordersTable.userId, input.userId),
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
      deliveryAddress: true,
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
}

// Get order status statistics
export async function getOrderStatusStats() {
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
}

// Search orders (for admin)
export async function searchOrders(input: SearchOrdersInput) {
  const userTableAlias = alias(usersTable, "u_table");
  const page = input.page ?? 1;
  const limit = input.limit ?? 20;
  const offset = (page - 1) * limit;

  // Step 1: Find userIds if search keyword exists
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

  // Step 2: Build dynamic query
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

  // Step 3: Build WHERE conditions
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

  if (input.paymentMethod && input.paymentMethod !== "all") {
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

  // Step 4: Build ORDER BY
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

  // Step 5: Execute query
  const res = await qb
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  // Step 6: Get total count
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
}

// Get order by ID
export async function getOrderById(orderId: number) {
  const order = await db.query.orders.findFirst({
    where: eq(ordersTable.id, orderId),
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
}

// Update order status
export async function updateOrderStatus(input: UpdateOrderStatusInput) {
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
}

// Cancel order
export async function cancelOrder(orderId: number) {
  // Get order items before cancelling
  const order = await db.query.orders.findFirst({
    where: eq(ordersTable.id, orderId),
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
  await db
    .update(ordersTable)
    .set({ status: "cancelled" })
    .where(eq(ordersTable.id, orderId));

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
}

