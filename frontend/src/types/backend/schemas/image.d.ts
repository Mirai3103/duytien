import { z } from "zod";
export declare const updateProductVariantImagesSchema: z.ZodObject<{
    variantId: z.ZodNumber;
    newImages: z.ZodArray<z.ZodString>;
    deletedImages: z.ZodArray<z.ZodNumber>;
}, z.core.$strip>;
export type UpdateProductVariantImages = z.infer<typeof updateProductVariantImagesSchema>;
