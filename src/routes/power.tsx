import { createFileRoute } from "@tanstack/react-router";
import { RouteViewPower } from "@/routes.ts";
import { ViewFactoryPower } from "@/views/ViewFactoryPower.tsx";

export const Route = createFileRoute(RouteViewPower)({
	component: ViewFactoryPower,
});
