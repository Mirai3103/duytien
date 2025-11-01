import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../trpc";
import z from "zod";
import { eq } from "drizzle-orm";
import db from "@/db";
import { user as usersTable, addresses } from "@/db/schema";
import { auth } from "@/auth";
const addressRoute = router({
  getAddresses: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
    }
    return await db.query.addresses.findMany({
      where: eq(addresses.userId, ctx.session.user.id),
    });
  }),
  setDefaultAddress: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
      }
      // set all addresses to not default
      await db
        .update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.userId, ctx.session.user.id));
      return await db
        .update(addresses)
        .set({ isDefault: true })
        .where(eq(addresses.id, input.id));
    }),
  createAddress: publicProcedure
    .input(
      z.object({
        phone: z.string(),
        ward: z.string(),
        district: z.string(),
        province: z.string(),
        detail: z.string(),
        fullName: z.string(),
        note: z.string(),
        isDefault: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
      }
      if (input.isDefault) {
        await db
          .update(addresses)
          .set({ isDefault: false })
          .where(eq(addresses.userId, ctx.session.user.id));
      }
      const [address] = await db
        .insert(addresses)
        .values({
          phone: input.phone,
          ward: input.ward,
          district: input.district,
          province: input.province,
          detail: input.detail,
          fullName: input.fullName,
          note: input.note,
          userId: ctx.session.user.id!,
          isDefault: input.isDefault,
        })
        .returning();

      return address?.id!;
    }),
  deleteAddress: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
      }
      return await db.delete(addresses).where(eq(addresses.id, input.id));
    }),
  updateAddress: publicProcedure
    .input(
      z.object({
        id: z.number(),
        phone: z.string(),
        ward: z.string(),
        district: z.string(),
        province: z.string(),
        detail: z.string(),
        fullName: z.string(),
        note: z.string(),
        isDefault: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
      }
      await db
        .update(addresses)
        .set({
          phone: input.phone,
          ward: input.ward,
          district: input.district,
          province: input.province,
          detail: input.detail,
          fullName: input.fullName,
          note: input.note,
          isDefault: input.isDefault,
        })
        .where(eq(addresses.id, input.id));
      return { success: true };
    }),
});
export { addressRoute };
