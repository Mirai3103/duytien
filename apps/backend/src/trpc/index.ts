import { brandRoute } from "./routes/brand.route";
import { categoriesRoute } from "./routes/categories.route";
import { productsRoute } from "./routes/products.route";
import { variantsRoute } from "./routes/variants.route";
import { variantImagesRouter } from "./routes/variant-images.route";
import { router } from "./trpc";
import { attributesRoute } from "./routes/attributes.route";
export const appRouter = router({
  products: productsRoute,
  variants: variantsRoute,
  variantImages: variantImagesRouter,
  categories: categoriesRoute,
  brands: brandRoute,
  attributes: attributesRoute,
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
