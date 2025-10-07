import SearchProducts from "@/pages/search";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/search")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SearchProducts />;
}
