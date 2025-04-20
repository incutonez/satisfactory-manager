import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { loadItemThunk } from "@/api/activeItem.ts";
import { getInventory } from "@/api/inventory.ts";
import { RouteViewItem } from "@/routes.ts";
import { useAppDispatch, useAppSelector } from "@/store.ts";
import { IRouteViewItem } from "@/types.ts";
import { ViewInventoryItem } from "@/views/ViewInventoryItem.tsx";

export const Route = createFileRoute(RouteViewItem)({
	component: RouteComponent,
	params: {
		parse: (params) => params as IRouteViewItem,
	},
});

function RouteComponent() {
	const { itemId, recipeType } = Route.useParams();
	const [showDialog, setShowDialog] = useState(false);
	const dispatch = useAppDispatch();
	const data = useAppSelector(getInventory);

	useEffect(() => {
		if (data.length) {
			dispatch(loadItemThunk(itemId));
			setShowDialog(true);
		}
	}, [itemId, dispatch, data]);

	return (
		<ViewInventoryItem
			recipeType={recipeType}
			show={showDialog}
			setShow={setShowDialog}
		/>
	);
}
