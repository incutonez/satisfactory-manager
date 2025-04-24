import "@/index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "@/router.ts";
import { store } from "@/store.ts";

createRoot(document.getElementById("root")!).render(<StrictMode>
	<Provider store={store}>
		<RouterProvider router={router} />
	</Provider>
</StrictMode>);
