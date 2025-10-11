import ChatBox from "@/components/ChatBox";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_storefront")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <ChatBox />
      <Outlet />
    </>
  );
}
