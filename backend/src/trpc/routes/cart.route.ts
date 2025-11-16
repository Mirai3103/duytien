import z from "zod";
import { protectedProcedure, router } from "../trpc";
import {
  addToCartSchema,
  removeFromCartSchema,
  updateCartItemSchema,
} from "@/schemas/cart";
import { type inferProcedureOutput } from "@trpc/server";
import * as CartService from "@/services/cart";

const cartRoute = router({
  getCart: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session!.session.userId;
    return await CartService.getCart(userId);
  }),
  addToCart: protectedProcedure
    .input(addToCartSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session!.session.userId;
      return await CartService.addToCart(userId, input);
    }),
  removeFromCart: protectedProcedure
    .input(removeFromCartSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session!.session.userId;
      return await CartService.removeFromCart(userId, input);
    }),
  updateCartItem: protectedProcedure
    .input(updateCartItemSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session!.session.userId;
      return await CartService.updateCartItem(userId, input);
    }),
  clearCart: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session!.session.userId;
    return await CartService.clearCart(userId);
  }),
  countCartItems: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session!.session.userId;
    return await CartService.countCartItems(userId);
  }),
  getCartItemsInIds: protectedProcedure
    .input(z.array(z.number()))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session!.session.userId;
      return await CartService.getCartItemsInIds(userId, input);
    }),
});

export default cartRoute;

export type GetCartResponse = inferProcedureOutput<typeof cartRoute.getCart>;
