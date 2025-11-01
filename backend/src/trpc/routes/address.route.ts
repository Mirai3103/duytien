import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../trpc";
import z from "zod";
import { eq } from "drizzle-orm";
import db from "@/db";
import { addresses } from "@/db/schema";
export interface Province {
  code: string;
  name: string;
  englishName: string;
  administrativeLevel: string;
  decree: string;
}
export interface Commune {
  code: string;
  name: string;
  englishName: string;
  administrativeLevel: string;
  provinceCode: string;
  provinceName: string;
  decree: string;
}
const ADDRESS_API_BASE = "https://production.cas.so/address-kit";
const createAddressSchema = z.object({
  phone: z.string(),
  ward: z.string(),
  province: z.string(),
  detail: z.string(),
  fullName: z.string(),
  note: z.string(),
  isDefault: z.boolean(),
});
const updateAddressSchema = createAddressSchema.partial().extend({
  id: z.number(),
});
const addressRoute = router({
  // Proxy endpoint to get provinces
  getProvinces: publicProcedure.query(async () => {
    try {
      const response = await fetch(`${ADDRESS_API_BASE}/latest/provinces`);
      if (!response.ok) {
        console.log(await response.text());
        throw new Error("Failed to fetch provinces");
      }
      console.log(`${ADDRESS_API_BASE}/latest/provinces`);
      const data = (await response.json()) as { provinces: Province[] };
      return data.provinces as Province[];
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch provinces",
      });
    }
  }),
  // Proxy endpoint to get wards of a province
  getWards: publicProcedure
    .input(
      z.object({
        provinceCode: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const response = await fetch(
          `${ADDRESS_API_BASE}/latest/provinces/${input.provinceCode}/communes`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch wards");
        }
        const data = (await response.json()) as { communes: Commune[] };
        return data.communes as Commune[];
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch wards",
        });
      }
    }),
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
      await db
        .update(addresses)
        .set({ isDefault: true })
        .where(eq(addresses.id, input.id));
      return { success: true };
    }),
  createAddress: publicProcedure
    .input(createAddressSchema)
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
      await db.delete(addresses).where(eq(addresses.id, input.id));
      return { success: true };
    }),
  updateAddress: publicProcedure
    .input(updateAddressSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
      }
      await db
        .update(addresses)
        .set({
          phone: input.phone,
          ward: input.ward,
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
