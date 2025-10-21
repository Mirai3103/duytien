import z from "zod";
import slugify from "slugify";
export const querySchema = z.object({
    page: z.number().default(1).optional(),
    limit: z.number().default(20).optional(),
    search: z.string().default("").optional(),
});
export const createBrandSchema = z.object({
    name: z.string().min(1, "Tên thương hiệu không được để trống"),
    slug: z
        .string()
        .transform((val) => slugify(val, { lower: true, strict: true }) + "-" + Date.now()),
    logo: z.string().optional(),
});
export const updateBrandSchema = createBrandSchema.extend({
    id: z.number(),
});
