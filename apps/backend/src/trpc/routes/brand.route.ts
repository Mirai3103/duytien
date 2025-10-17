import {
  createBrandSchema,
  querySchema,
  updateBrandSchema,
} from "@f5tech/schemas/brand";
import { desc, eq, ilike } from "drizzle-orm";
import z from "zod";
import db from "@/db";
import { brands as brandsTable } from "@/db/schema";
import { publicProcedure, router } from "../trpc";

export const brandRoute = router({
  getAll: publicProcedure.input(querySchema).query(async ({ input }) => {
    const { page, limit, search } = input;
    const brands = await db.query.brands.findMany({
      where: ilike(brandsTable.name, `%${search}%`),
      offset: (page! - 1) * limit!,
      limit: limit,
      orderBy: [desc(brandsTable.name)],
    });
    return brands;
  }),
  create: publicProcedure
    .input(createBrandSchema)
    .mutation(async ({ input }) => {
      const _brand = await db
        .insert(brandsTable)
        .values({ name: input.name, slug: input.slug, logo: input.logo });
      return { success: true };
    }),
  update: publicProcedure
    .input(updateBrandSchema)
    .mutation(async ({ input }) => {
      const _brand = await db
        .update(brandsTable)
        .set({
          name: input.name,
          slug: input.slug,
          logo: input.logo,
        })
        .where(eq(brandsTable.id, input.id!));
      return { success: true };
    }),
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const brand = await db
        .delete(brandsTable)
        .where(eq(brandsTable.id, input.id))
        .returning();
      if (brand[0]!.logo) {
      }
      return { success: true };
    }),
});
