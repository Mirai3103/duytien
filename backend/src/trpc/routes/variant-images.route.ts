import { and, eq, inArray } from "drizzle-orm";
import db from "@/db";
import { productVariantImages, productVariants } from "@/db/schema";
import { publicProcedure, router } from "../trpc";
import { updateProductVariantImagesSchema } from "@/schemas/image";
import { removeByKeys } from "@/utils/file.utils";

export const variantImagesRouter = router({
  editVariantImages: publicProcedure
    .input(updateProductVariantImagesSchema)
    .mutation(async ({ input }) => {
      const { variantId, newImages, deletedImages } = input;
      const deletedImagesIds = await db
        .delete(productVariantImages)
        .where(
          and(
            eq(productVariantImages.variantId, variantId),
            inArray(productVariantImages.id, deletedImages)
          )
        )
        .returning({ url: productVariantImages.image });
      await removeByKeys(deletedImagesIds.map((img) => img.url));

      const newImgs = await db
        .insert(productVariantImages)
        .values(newImages.map((image) => ({ variantId, image })))
        .returning({ id: productVariantImages.image });
      return newImgs.map((img) => img.id);
    }),
});
