import { useEffect } from "react";
import { Provider } from "react-redux";
import { createRootRoute } from "@tanstack/react-router";
import { getActiveFactory, loadFactoriesThunk, loadFactoryInventoryThunk } from "@/api/factories.ts";
import { store, useAppDispatch, useAppSelector } from "@/store.ts";
import { ViewMain } from "@/views/ViewMain.tsx";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	const dispatch = useAppDispatch();
	const activeFactory = useAppSelector(getActiveFactory);

	useEffect(() => {
		dispatch(loadFactoriesThunk());
	}, [dispatch]);

	useEffect(() => {
		if (activeFactory) {
			dispatch(loadFactoryInventoryThunk());
		}
	}, [activeFactory, dispatch]);

	return (
		<>
			<Provider store={store}>
				<main className="flex flex-col size-full space-y-2">
					<ViewMain />
				</main>
			</Provider>
		</>
	);
}
