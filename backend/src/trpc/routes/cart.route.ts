import { and, count, eq, inArray, isNull, sql } from "drizzle-orm";
import z from "zod";
import db from "@/db";
import { cartItems as cartItemsTable } from "@/db/schema";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import {
  addToCartSchema,
  removeFromCartSchema,
  updateCartItemSchema,
} from "@/schemas/cart";
import { productVariants as productVariantsTable } from "@/db/schema";
import { TRPCError, type inferProcedureOutput } from "@trpc/server";

const cartRoute = router({
  getCart: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session!.session.userId;

    const cart = await db.query.cartItems.findMany({
      where: eq(cartItemsTable.userId, userId),
      with: {
        variant: {
          with: {
            variantValues: {
              with: {
                value: true,
              },
            },
          },
        },
      },
    });
    return cart;
  }),
  addToCart: protectedProcedure
    .input(addToCartSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session!.session.userId;
      const { variantId, quantity } = input;
      const variant = await db.query.productVariants.findFirst({
        where: eq(productVariantsTable.id, variantId),
      });
      if (!variant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Variant not found",
        });
      }
      const existingCartItem = await db.query.cartItems.findFirst({
        where: and(
          eq(cartItemsTable.userId, userId),
          eq(cartItemsTable.variantId, variantId)
        ),
      });
      const totalCartItemQuantity = existingCartItem
        ? existingCartItem.quantity + quantity
        : quantity;
      if (totalCartItemQuantity > variant.stock) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Stock not enough",
        });
      }
      if (existingCartItem) {
        await db
          .update(cartItemsTable)
          .set({ quantity: totalCartItemQuantity })
          .where(eq(cartItemsTable.id, existingCartItem.id));
      } else {
        await db.insert(cartItemsTable).values({
          userId,
          variantId,
          quantity: totalCartItemQuantity,
          price: variant.price,
        });
      }
      return { success: true };
    }),
  removeFromCart: protectedProcedure
    .input(removeFromCartSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session!.session.userId;
      const { cartItemId } = input;
      await db.delete(cartItemsTable).where(eq(cartItemsTable.id, cartItemId));
      return { success: true };
    }),
  updateCartItem: protectedProcedure
    .input(updateCartItemSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session!.session.userId;
      const { cartItemId, quantity } = input;
      await db
        .update(cartItemsTable)
        .set({ quantity })
        .where(eq(cartItemsTable.id, cartItemId));
      return { success: true };
    }),
  clearCart: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session!.session.userId;
    await db.delete(cartItemsTable).where(eq(cartItemsTable.userId, userId));
    return { success: true };
  }),
  countCartItems: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session!.session.userId;
    const result = await db
      .select({ count: count() })
      .from(cartItemsTable)
      .where(eq(cartItemsTable.userId, userId));
    return result[0]?.count ?? 0;
  }),
  getCartItemsInIds: protectedProcedure
    .input(z.array(z.number()))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session!.session.userId;
      const result = await db.query.cartItems.findMany({
        where: and(
          eq(cartItemsTable.userId, userId),
          inArray(cartItemsTable.id, input)
        ),
        with: {
          variant: {
            with: {
              variantValues: {
                with: {
                  value: true,
                },
              },
            },
          },
        },
      });
      return result;
    }),
});

export default cartRoute;

export type GetCartResponse = inferProcedureOutput<typeof cartRoute.getCart>;
