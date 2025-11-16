import db from "@/db";
import { categories as categoriesTable } from "@/db/schema";
import type z from "zod";
import { categoryCreate, categoryUpdate } from "@/schemas/category";
import { eq, isNull, sql } from "drizzle-orm";

export async function getAllParentCategories() {
  const categories = await db.query.categories.findMany({
    where: isNull(categoriesTable.parentId),
    with: {
      children: true,
    },
  });
  return categories;
}

export async function getByParentId(input: { parentId: string }) {
  const categories = await db.query.categories.findMany({
    where: eq(categoriesTable.parentId, Number(input.parentId)),
    with: {
      children: true,
    },
  });
  return categories;
}

export async function getAllParents(input: { categoryId: string }) {
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
}

export async function createCategory(input: z.infer<typeof categoryCreate>) {
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
}

export async function updateCategory(input: z.infer<typeof categoryUpdate>) {
  const _category = await db
    .update(categoriesTable)
    .set({
      name: input.name,
      slug: input.slug,
      parentId: input.parentId,
    })
    .where(eq(categoriesTable.id, Number(input.id)));
  return { success: true };
}

export async function deleteCategory(input: { id: string }) {
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
}

export async function getAllCategories() {
  const categories = await db.query.categories.findMany();
  return categories;
}