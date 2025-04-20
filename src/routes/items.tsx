import { createFileRoute } from "@tanstack/react-router";
import { RouteViewItems } from "@/routes.ts";
import { ViewInventoryItems } from "@/views/ViewInventoryItems.tsx";

export const Route = createFileRoute(RouteViewItems)({
	component: ViewInventoryItems,
	loader() {

	},
});
