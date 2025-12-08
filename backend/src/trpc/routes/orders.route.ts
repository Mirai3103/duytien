import z from "zod";
import { protectedProcedure, router } from "../trpc";
import { type inferProcedureOutput } from "@trpc/server";
import {
  createOrderService,
  getUserOrders,
  getOrderStatusStats,
  searchOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from "@/services/orders";

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
      return createOrderService({
        ...input,
        userId: ctx.session!.session.userId,
      });
    }),
  getOrders: protectedProcedure
    .input(
      z.object({
        page: z.number().optional().default(1),
        limit: z.number().optional().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      return getUserOrders({
        userId: ctx.session!.session.userId,
        page: input.page,
        limit: input.limit,
      });
    }),

  getStatusStats: protectedProcedure.query(async ({ ctx }) => {
    return getOrderStatusStats();
  }),
  searchOrders: protectedProcedure // for admin
    .input(searchOrdersSchema)
    .query(async ({ input }) => {
      return searchOrders(input);
    }),
  getOrder: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      return getOrderById(input.id);
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "shipping", "delivered", "cancelled"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return updateOrderStatus(input);
    }),
  cancelOrder: protectedProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      return cancelOrder(input.id);
    }),
});

export type SearchOrdersOutput = inferProcedureOutput<
  typeof ordersRoute.searchOrders
>;
