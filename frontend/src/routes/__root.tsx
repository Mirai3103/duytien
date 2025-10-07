import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import ChatBox from "@/components/ChatBox";

const RootLayout = () => (
  <>
    <Outlet />
    <ChatBox />
    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
