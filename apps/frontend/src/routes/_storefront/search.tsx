import { createFileRoute } from "@tanstack/react-router";
import SearchProducts from "@/pages/search";

export const Route = createFileRoute("/_storefront/search")({
	component: RouteComponent,
	loader: async ({ context, params }) => {
		const { trpc, queryClient } = context;
		return await queryClient.ensureQueryData(
			trpc.products.getProductsWithVariants.queryOptions({
				page: 1,
				limit: 10,
			}),
		);
	},
});

function RouteComponent() {
	return <SearchProducts />;
}
