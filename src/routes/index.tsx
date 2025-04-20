import { createFileRoute, redirect } from "@tanstack/react-router";
import { RouteHome, RouteViewItems } from "@/routes.ts";

export const Route = createFileRoute(RouteHome)({
	loader() {
		throw redirect({
			to: RouteViewItems,
		});
	},
});
