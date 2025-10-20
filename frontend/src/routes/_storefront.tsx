import { createFileRoute, Outlet } from "@tanstack/react-router";
import ChatBox from "@/components/ChatBox";

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
