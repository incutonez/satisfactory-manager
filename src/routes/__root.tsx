import { Provider } from "react-redux";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { store } from "@/store.ts";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	return (
		<>
			<Provider store={store}>
				<main className="flex size-full overflow-hidden">
					<Outlet />
				</main>
			</Provider>
		</>
	);
}
