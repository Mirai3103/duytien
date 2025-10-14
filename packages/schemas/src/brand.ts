import z from "zod";
import { base64FileSchema } from "./utils";

export const querySchema = z.object({
	page: z.number().default(1).optional(),
	limit: z.number().default(20).optional(),
	search: z.string().default("").optional(),
});
export type QuerySchema = z.infer<typeof querySchema>;

export const createBrandSchema = z.object({
	name: z.string().min(1, "Tên thương hiệu không được để trống"),
	slug: z.string().min(1, "Slug không được để trống"),
	image: base64FileSchema.optional(),
});
export type CreateBrandSchema = z.infer<typeof createBrandSchema>;

export const updateBrandSchema = createBrandSchema
	.extend({
		id: z.number(),
		withImage: z.boolean().default(false).optional(),
	})
	.refine((data) => {
		if (data.withImage) {
			return data.image !== undefined;
		}
	});
export type UpdateBrandSchema = z.infer<typeof updateBrandSchema>;
