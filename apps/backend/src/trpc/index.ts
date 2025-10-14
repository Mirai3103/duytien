import { brandRoute } from "./routes/brand.route";
import { categoriesRoute } from "./routes/categories.route";
import { productsRoute } from "./routes/products.route";
import { variantsRoute } from "./routes/variants.route";
import { router } from "./trpc";
export const appRouter = router({
	products: productsRoute,
	variants: variantsRoute,
	categories: categoriesRoute,
	brands: brandRoute,
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
