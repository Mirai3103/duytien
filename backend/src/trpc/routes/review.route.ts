import db from "@/db";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";
import {
  productVariants as productVariantsTable,
  reviews as reviewsTable,
  orderItems as orderItemsTable,
  orders as ordersTable,
  products as productsTable,
} from "@/db/schema";
import { and, count, avg, desc, eq, inArray, lt } from "drizzle-orm";

export const reviewRoute = router({
  getReviewsOfProduct: publicProcedure
    .input(
      z.object({
        variantId: z.number(),
        limit: z.number().min(1).max(50).default(10),
        cursor: z.number().optional(), // dùng id làm cursor
      })
    )
    .query(async ({ input }) => {
      const { variantId, limit, cursor } = input;

      const reviews = await db.query.reviews.findMany({
        where: and(
          eq(reviewsTable.variantId, variantId),
          cursor ? lt(reviewsTable.id, cursor) : undefined
        ),
        with: {
          user: {
            columns: {
              id: true,
              name: true,
            },
          },
          variant: {
            columns: {
              id: true,
              name: true,
            },
            with: {
              variantValues: true,
            },
          },
        },
        orderBy: desc(reviewsTable.id),
        limit: limit + 1, // +1 để check có next page không
      });

      let nextCursor: number | undefined = undefined;
      if (reviews.length > limit) {
        const nextItem = reviews.pop(); // bỏ item thừa ra để lấy cursor
        nextCursor = nextItem!.id;
      }

      return {
        reviews,
        nextCursor,
      };
    }),
  getProductReviewStats: publicProcedure
    .input(
      z.object({
        productId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const reviews = await db
        .select({
          variantId: reviewsTable.variantId,
          rating: reviewsTable.rating,
          comment: reviewsTable.comment,
        })
        .from(reviewsTable)
        .innerJoin(
          productVariantsTable,
          eq(reviewsTable.variantId, productVariantsTable.id)
        )
        .where(eq(productVariantsTable.productId, input.productId)); // ✅ fix đúng cột

      const totalReviews = reviews.length;
      const total5Stars = reviews.filter((r) => r.rating === 5).length;
      const total4Stars = reviews.filter((r) => r.rating === 4).length;
      const total3Stars = reviews.filter((r) => r.rating === 3).length;
      const total2Stars = reviews.filter((r) => r.rating === 2).length;
      const total1Stars = reviews.filter((r) => r.rating === 1).length;

      const averageRating =
        totalReviews > 0
          ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
          : 0;

      return {
        total5Stars,
        total4Stars,
        total3Stars,
        total2Stars,
        total1Stars,
        totalReviews,
        averageRating,
      };
    }),
  checkCanReview: protectedProcedure
    .input(
      z.object({
        productId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      // người dùng đã mua 1 variant của sản phẩm này chưa
      // lấy các order có status đã hoàn thành
      const completedOrders = await db.query.orders.findMany({
        where: and(
          eq(ordersTable.userId, ctx.session!.session.userId),
          eq(ordersTable.status, "delivered")
        ),
        columns: {
          id: true,
        },
      });
      if (!completedOrders.length) {
        return false;
      }
      const completedOrderIds = completedOrders.map((order) => order.id);
      const orderItems = await db
        .select({
          variantId: orderItemsTable.variantId,
        })
        .from(orderItemsTable)
        .innerJoin(
          productVariantsTable,
          eq(orderItemsTable.variantId, productVariantsTable.id)
        )
        .where(
          and(
            inArray(orderItemsTable.orderId, completedOrderIds),
            eq(productVariantsTable.productId, input.productId)
          )
        )
        ;
      const variantIds = orderItems.map((orderItem) => orderItem.variantId);
      const userReviewsVariantIds = await db.select({
        variantId: reviewsTable.variantId,
      }).from(reviewsTable).where(
        and(
          eq(reviewsTable.userId, ctx.session!.session.userId),
          inArray(reviewsTable.variantId, variantIds)
        )
      );
      // lấy các id mà chưa đánh giá
      const variantIdsNotReviewed = variantIds.filter((variantId) => !userReviewsVariantIds.some((review) => review.variantId === variantId));
      return variantIdsNotReviewed
    }),
  createReview: protectedProcedure
    .input(
      z.object({
        variantId: z.number(),
        rating: z.number(),
        comment: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const review = await db.insert(reviewsTable).values({
        userId: ctx.session!.session.userId,
        variantId: input.variantId,
        rating: input.rating,
        comment: input.comment,
      });
      return { success: true };
    }),
  editReview: protectedProcedure
    .input(
      z.object({
        reviewId: z.number(),
        rating: z.number(),
        comment: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const review = await db
        .update(reviewsTable)
        .set({
          rating: input.rating,
          comment: input.comment,
        })
        .where(eq(reviewsTable.id, input.reviewId));
      return { success: true };
    }),
  deleteReview: protectedProcedure
    .input(
      z.object({
        reviewId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const review = await db
        .delete(reviewsTable)
        .where(eq(reviewsTable.id, input.reviewId));
      return { success: true };
    }),
});
