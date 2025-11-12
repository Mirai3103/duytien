import { addressRoute } from "./routes/address.route";
import { attributesRoute } from "./routes/attributes.route";
import { brandRoute } from "./routes/brand.route";
import cartRoute from "./routes/cart.route";
import { categoriesRoute } from "./routes/categories.route";
import { dashboardRoute } from "./routes/dashboard.route";
import { ordersRoute } from "./routes/orders.route";
import { paymentRoute } from "./routes/payment.route";
import { productsRoute } from "./routes/products.route";
import { reviewRoute } from "./routes/review.route";
import { specsRoute } from "./routes/specs.route";
import { usersRoute } from "./routes/users.route";
import { variantImagesRouter } from "./routes/variant-images.route";
import { variantsRoute } from "./routes/variants.route";
import { vouchersRoute } from "./routes/vouchers.route";
import { router } from "./trpc";
export const appRouter = router({
  products: productsRoute,
  variants: variantsRoute,
  variantImages: variantImagesRouter,
  categories: categoriesRoute,
  brands: brandRoute,
  attributes: attributesRoute,
  specs: specsRoute,
  users: usersRoute,
  cart: cartRoute,
  addresses: addressRoute,
  orders: ordersRoute,
  vouchers: vouchersRoute,
  payment: paymentRoute,
  review: reviewRoute,
  dashboard: dashboardRoute,
});
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
