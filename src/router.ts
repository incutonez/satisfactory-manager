﻿import { createHashHistory, createRouter } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";

export const router = createRouter({
	routeTree,
	history: createHashHistory(),
	trailingSlash: "preserve",
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
