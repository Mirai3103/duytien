import { categoryCreate, categoryUpdate } from "@f5tech/schemas/category";
import { eq, isNull, sql } from "drizzle-orm";
import z from "zod";
import db from "@/db";
import { categories as categoriesTable } from "@/db/schema";
import { publicProcedure, router } from "../trpc";
export const categoriesRoute = router({
	getAllParentCategories: publicProcedure.query(async () => {
		const categories = await db.query.categories.findMany({
			where: isNull(categoriesTable.parentId),
			with: {
				children: true,
			},
		});
		return categories;
	}),
	getByParentId: publicProcedure
		.input(z.object({ parentId: z.string() }))
		.query(async ({ input }) => {
			const categories = await db.query.categories.findMany({
				where: eq(categoriesTable.parentId, Number(input.parentId)),
				with: {
					children: true,
				},
			});
			return categories;
		}),
	getAllParents: publicProcedure
		.input(z.object({ categoryId: z.string() }))
		.query(async ({ input }) => {
			const result = (await db.execute(sql`
            WITH RECURSIVE parent_tree AS (
              SELECT id, name, slug, parent_id
              FROM categories
              WHERE id = ${input.categoryId}
              UNION ALL
              SELECT c.id, c.name, c.slug, c.parent_id
              FROM categories c
              INNER JOIN parent_tree pt ON c.id = pt.parent_id
            )
            SELECT * FROM parent_tree;
          `)) as any;
			return result;
		}),
	create: publicProcedure.input(categoryCreate).mutation(async ({ input }) => {
		const _category = await db.insert(categoriesTable).values({
			name: input.name,
			slug: input.slug,
			parentId: input.parentId,
		});
		if (input.parentId) {
			db.update(categoriesTable)
				.set({
					metadata: sql`jsonb_set(
            ${categoriesTable.metadata},
            '{totalChild}',
            to_jsonb( (COALESCE((${categoriesTable.metadata} ->> 'totalChild')::int, 0) + 1) )
          )`,
				})
				.where(eq(categoriesTable.id, input.parentId));
		}
		return { success: true };
	}),
	update: publicProcedure.input(categoryUpdate).mutation(async ({ input }) => {
		const _category = await db
			.update(categoriesTable)
			.set({
				name: input.name,
				slug: input.slug,
				parentId: input.parentId,
			})
			.where(eq(categoriesTable.id, Number(input.id)));
		return { success: true };
	}),
	delete: publicProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input }) => {
			const category = await db
				.delete(categoriesTable)
				.where(eq(categoriesTable.id, Number(input.id)))
				.returning();
			if (category[0]!.parentId) {
				db.update(categoriesTable)
					.set({
						metadata: sql`jsonb_set(
            ${categoriesTable.metadata},
            '{totalChild}',
            to_jsonb( (COALESCE((${categoriesTable.metadata} ->> 'totalChild')::int, 0) - 1) )
          )`,
					})
					.where(eq(categoriesTable.id, category[0]!.parentId));
			}
			return { success: true };
		}),
});
