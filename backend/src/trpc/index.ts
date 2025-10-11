import { productsRoute } from './routes/products.route';
import { variantsRoute } from './routes/variants.route';
import { publicProcedure, router } from './trpc';
 
export const appRouter = router({
   products: productsRoute,
   variants: variantsRoute,
});
 
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;