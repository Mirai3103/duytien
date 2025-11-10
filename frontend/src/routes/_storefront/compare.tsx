import { createFileRoute } from "@tanstack/react-router";
import CompareProducts from "@/components/pages/compare";

export const Route = createFileRoute("/_storefront/compare")({
  component: RouteComponent,
  loader: async () => {
    return {
      // We'll fetch variant details dynamically based on store state
    };
  },
});

function RouteComponent() {
  return <CompareProducts />;
}
