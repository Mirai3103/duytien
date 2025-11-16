import db from "@/db";
import { cartItems as cartItemsTable, productVariants as productVariantsTable } from "@/db/schema";
import type z from "zod";
import {
  addToCartSchema,
  removeFromCartSchema,
  updateCartItemSchema,
} from "@/schemas/cart";
import { and, count, eq, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export async function getCart(userId: string) {
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
  return cart;
}

export async function addToCart(
  userId: string,
  input: z.infer<typeof addToCartSchema>
) {
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
}

export async function removeFromCart(
  userId: string,
  input: z.infer<typeof removeFromCartSchema>
) {
  const { cartItemId } = input;
  await db.delete(cartItemsTable).where(eq(cartItemsTable.id, cartItemId));
  return { success: true };
}

export async function updateCartItem(
  userId: string,
  input: z.infer<typeof updateCartItemSchema>
) {
  const { cartItemId, quantity } = input;
  await db
    .update(cartItemsTable)
    .set({ quantity })
    .where(eq(cartItemsTable.id, cartItemId));
  return { success: true };
}

export async function clearCart(userId: string) {
  await db.delete(cartItemsTable).where(eq(cartItemsTable.userId, userId));
  return { success: true };
}

export async function countCartItems(userId: string) {
  const result = await db
    .select({ count: count() })
    .from(cartItemsTable)
    .where(eq(cartItemsTable.userId, userId));
  return result[0]?.count ?? 0;
}

export async function getCartItemsInIds(userId: string, cartItemIds: number[]) {
  const result = await db.query.cartItems.findMany({
    where: and(
      eq(cartItemsTable.userId, userId),
      inArray(cartItemsTable.id, cartItemIds)
    ),
    with: {
      variant: {
        with: {
          variantValues: {
            with: {
              value: true,
            },
          },
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
  return result;
}

