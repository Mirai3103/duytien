import z from "zod";
import slugify from "slugify";
export const category = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  parentId: z.number().nullable(),
});
export type Category = z.infer<typeof category>;

export const categoryWithChildren = category.extend({
  children: z.array(category),
});
export type CategoryWithChildren = z.infer<typeof categoryWithChildren>;

export const categoryCreate = z.object({
  name: z.string().min(1, "Tên danh mục không được để trống"),
  slug: z
    .string()
    .transform(
      (val) => slugify(val, { lower: true, strict: true }) + "-" + Date.now()
    ),
  parentId: z.number().nullable(),
});
export type CategoryCreate = z.infer<typeof categoryCreate>;

export const categoryUpdate = categoryCreate.extend({
  id: z.string(),
});
export type CategoryUpdate = z.infer<typeof categoryUpdate>;
