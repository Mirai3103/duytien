import { z } from "zod";
export const updateProductVariantImagesSchema = z.object({
    variantId: z.number(),
    newImages: z.array(z.string()),
    deletedImages: z.array(z.number()),
});
