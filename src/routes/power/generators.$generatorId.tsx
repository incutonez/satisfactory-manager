import { useEffect, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { getPowerData, loadPowerGenerator, setActivePowerItem } from "@/api/power.ts";
import { RouteCreate, RouteViewPowerGenerator } from "@/routes.ts";
import { useAppDispatch, useAppSelector } from "@/store.ts";
import { uuid } from "@/utils/common.ts";
import { ViewGenerator } from "@/views/ViewGenerator.tsx";

export const Route = createFileRoute(RouteViewPowerGenerator)({
	component: RouteComponent,
});

function RouteComponent() {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [show, setShow] = useState(false);
	const { generatorId } = Route.useParams();
	const data = useAppSelector(getPowerData);

	function onSetShow(showing: boolean) {
		if (!showing) {
			router.history.back();
		}
	}

	useEffect(() => {
		if (generatorId === RouteCreate) {
			dispatch(setActivePowerItem({
				id: uuid(),
				name: "",
				image: "",
				powerType: "produces",
				basePower: 0,
				count: 1,
				somersloop: 0,
				overclock: 100,
			}));
			setShow(true);
		}
		else if (data.length) {
			dispatch(loadPowerGenerator(generatorId));
			setShow(true);
		}
	}, [generatorId, dispatch, data]);

	return (
		<ViewGenerator
			show={show}
			setShow={onSetShow}
		/>
	);
}
