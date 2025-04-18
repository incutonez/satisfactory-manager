import { Provider } from "react-redux";
import { store } from "@/store.ts";
import { ViewInventoryItems } from "@/views/ViewInventoryItems.tsx";

export function App() {
	return (
		<>
			<Provider store={store}>
				<main className="flex size-full overflow-hidden">
					<ViewInventoryItems />
				</main>
			</Provider>
		</>
	);
}
