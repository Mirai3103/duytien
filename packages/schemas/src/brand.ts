import z from "zod";

export const querySchema = z.object({
  page: z.number().default(1).optional(),
  limit: z.number().default(20).optional(),
  search: z.string().default("").optional(),
});
export type QuerySchema = z.infer<typeof querySchema>;

export const createBrandSchema = z.object({
  name: z.string().min(1, "Tên thương hiệu không được để trống"),
  slug: z.string().min(1, "Slug không được để trống"),
  logo: z.string().optional(),
});
export type CreateBrandSchema = z.infer<typeof createBrandSchema>;

export const updateBrandSchema = createBrandSchema.extend({
  id: z.number(),
});

export type UpdateBrandSchema = z.infer<typeof updateBrandSchema>;
