import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "../../backend/src/trpc";
import { TRPCProvider } from "./lib/trpc";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				// With SSR, we usually want to set some default staleTime
				// above 0 to avoid refetching immediately on the client
				staleTime: 60 * 1000,
			},
		},
	});
}
const browserQueryClient = makeQueryClient();
const trpcClient = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: "/trpc",
		}),
	],
});
const trpc = createTRPCOptionsProxy<AppRouter>({
	client: trpcClient,
	queryClient: browserQueryClient,
});
const router = createRouter({
	routeTree,
	context: {
		trpcClient,
		queryClient: browserQueryClient,
		trpc,
	} as const,
	scrollRestoration: true,
	defaultPreload: "intent",
} as const);

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
export default function App() {
	return (
		<TRPCProvider trpcClient={trpcClient} queryClient={browserQueryClient}>
			<QueryClientProvider client={browserQueryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</TRPCProvider>
	);
}
// https://f5tech.vercel.app/
// https://f5tech.vercel.app/search
// https://f5tech.vercel.app/cart
// https://f5tech.vercel.app/checkout
// https://f5tech.vercel.app/product/1
// https://f5tech.vercel.app/auth
// https://f5tech.vercel.app/forgot-password

// https://f5tech.vercel.app/admin/dashboard
// https://f5tech.vercel.app/admin/products
// https://f5tech.vercel.app/admin/skus
// https://f5tech.vercel.app/admin/orders
// https://f5tech.vercel.app/admin/customers
