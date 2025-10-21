import { createFileRoute } from "@tanstack/react-router";
import SearchProducts from "@/pages/search";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import type { GetProductsResponse } from "@/types/backend/trpc/routes/products.route";

// helper: ép kiểu number an toàn (reject NaN, Infinity → undefined)
const safeNumber = z.preprocess((val) => {
  const num = Number(val);
  return Number.isFinite(num) ? num : undefined;
}, z.number());

// limit: fallback default + clamp 200 nếu bị vượt quá
const safeLimit = z
  .preprocess((val) => {
    const num = Number(val);
    if (!Number.isFinite(num)) return undefined; // undefined → default
    return Math.min(num, 200); // clamp max 200
  }, z.number())
  .default(10);

export const productsQuerySchema = z.object({
  page: safeNumber.default(1),
  limit: safeLimit,
  keyword: z.string().optional(),

  brandId: z
    .array(safeNumber)
    .transform((val) => (val.includes(0) ? undefined : val))
    .optional(),

  categoryId: z
    .array(safeNumber)
    .transform((val) => (val.includes(0) ? undefined : val))
    .optional(),
  sortField: z.enum(["price", "name", "status", "createdAt"]).optional(),
  sortDirection: z.enum(["asc", "desc"]).optional(),
  priceMin: safeNumber.optional(),
  priceMax: safeNumber.optional(),
});

export const Route = createFileRoute("/_storefront/search")({
  component: RouteComponent,
  validateSearch: zodValidator(productsQuerySchema),
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps }) => {
    const { trpc, queryClient, trpcClient } = context;
    console.log({ deps });
    const params = {
      page: deps.search.page,
      limit: deps.search.limit,
      brandId: deps.search.brandId,
      categoryId: deps.search.categoryId,
      keyword: deps.search.keyword,
      price: {
        max: deps.search.priceMax,
        min: deps.search.priceMin,
      },
      sort: {
        field: deps.search.sortField,
        direction: deps.search.sortDirection,
      },
    };
    const p1 = trpcClient.products.getProductsWithVariants.query(params);
    const p2 = trpcClient.products.countProducts.query(params);
    return Promise.all([p1, p2]);
  },
});

function RouteComponent() {
  const [products, total] = Route.useLoaderData();
  return <SearchProducts products={products as any} total={total[0].count} />;
}
