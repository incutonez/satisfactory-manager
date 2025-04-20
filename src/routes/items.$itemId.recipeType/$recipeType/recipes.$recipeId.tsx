import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RouteViewRecipe } from "@/routes.ts";
import { IRouteViewItemRecipe } from "@/types.ts";
import { ViewRecipe } from "@/views/ViewRecipe.tsx";

export const Route = createFileRoute(RouteViewRecipe)({
	component: RouteComponent,
	params: {
		parse: (params) => params as IRouteViewItemRecipe,
	},
});

function RouteComponent() {
	const { itemId, recipeType, recipeId } = Route.useParams();
	const [showDialog, setShowDialog] = useState(true);

	return (
		<ViewRecipe
			itemId={itemId}
			recipeType={recipeType}
			recipeId={recipeId}
			show={showDialog}
			setShow={setShowDialog}
		/>
	);
}
