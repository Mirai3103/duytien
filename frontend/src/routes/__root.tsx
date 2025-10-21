import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { TRPCClient } from "@trpc/client";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@/types/backend/trpc";
import { Toaster } from "@/components/ui/sonner";
const RootLayout = () => (
  <>
    <Outlet />
    <TanStackRouterDevtools />
    <Toaster />
  </>
);
interface IRouterContext {
  trpcClient: TRPCClient<AppRouter>;
  queryClient: QueryClient;
  trpc: TRPCOptionsProxy<AppRouter>;
}

export const Route = createRootRouteWithContext<IRouterContext>()({
  component: RootLayout,
});
