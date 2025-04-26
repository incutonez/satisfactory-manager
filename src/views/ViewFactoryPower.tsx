import { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate } from "@tanstack/react-router";
import {
	ColumnDef,
	createColumnHelper,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel, SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { getCurrentSearch } from "@/api/activeItem.ts";
import { deletePowerGenerator, getPowerData, getTotalPower, getTotalPowerConsumption } from "@/api/power.ts";
import { BaseButton } from "@/components/BaseButton.tsx";
import { IconDelete, IconEdit } from "@/components/Icons.tsx";
import { TableData } from "@/components/TableData.tsx";
import { RouteViewPowerGenerator } from "@/routes.ts";
import { useAppDispatch, useAppSelector } from "@/store.ts";
import { IMachinePower } from "@/types.ts";
import { formatNumber } from "@/utils/common.ts";

const columnHelper = createColumnHelper<IMachinePower>();

export function ViewFactoryPower() {
	const data = useAppSelector(getPowerData);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const totalPowerProduced = useAppSelector(getTotalPower);
	const totalPowerConsumption = useAppSelector(getTotalPowerConsumption);
	const [columns, setColumns] = useState<ColumnDef<IMachinePower>[]>([]);
	const [globalFilter, setGlobalFilter] = useState<string>();
	const search = useAppSelector(getCurrentSearch);
	const [sorting, setSorting] = useState<SortingState>([]);
	const table = useReactTable({
		data,
		columns,
		globalFilterFn: "includesString",
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		state: {
			sorting,
			globalFilter,
		},
	});

	const onClickEditGenerator = useCallback((generator: IMachinePower) => {
		navigate({
			to: RouteViewPowerGenerator,
			params: {
				generatorId: generator.id,
			},
		});
	}, [navigate]);

	useEffect(() => {
		setGlobalFilter(search);
	}, [search]);

	useEffect(() => {
		setColumns([
			columnHelper.display({
				id: "actions",
				meta: {
					cellCls: "flex justify-center space-x-2",
					columnWidth: "min-w-auto",
				},
				cell(info) {
					const isDisabled = info.row.original.powerType === "consumes";
					return (
						<>
							<BaseButton
								isDisabled={isDisabled}
								icon={IconDelete}
								title="Delete Generator"
								onClick={() => dispatch(deletePowerGenerator(info.row.original))}
							/>
							<BaseButton
								isDisabled={isDisabled}
								icon={IconEdit}
								title="Edit Generator"
								onClick={() => onClickEditGenerator(info.row.original)}
							/>
						</>
					);
				},
			}),
			columnHelper.accessor("name", {
				header: "Machine Name",
			}),
			columnHelper.accessor("recipeName", {
				header: "Recipe Name",
			}),
			columnHelper.accessor("overclock", {
				header: "Overclock %",
				meta: {
					cellCls: "text-center",
					columnWidth: "min-w-auto",
				},
			}),
			columnHelper.accessor("somersloop", {
				header: "Somersloop",
				meta: {
					cellCls: "text-center",
					columnWidth: "min-w-auto",
				},
				cell: (info) => info.getValue() ?? 0,
			}),
			columnHelper.accessor("count", {
				header: "Count",
				meta: {
					cellCls: "text-center",
					columnWidth: "min-w-auto",
				},
			}),
			columnHelper.accessor("basePower", {
				id: "basePowerProduced",
				header: "Produced",
				meta: {
					cellCls: "text-right",
					columnWidth: "min-w-auto",
					footerCls: () => "text-right",
				},
				cell(info) {
					if (info.row.original.powerType === "consumes") {
						return "";
					}
					return formatNumber(info.getValue() ?? 0, "MW");
				},
				footer() {
					return formatNumber(totalPowerProduced, "MW");
				},
			}),
			columnHelper.accessor("basePower", {
				id: "basePowerConsumed",
				header: "Consumed",
				meta: {
					cellCls: "text-right",
					columnWidth: "min-w-auto",
					footerCls: () => "text-right",
				},
				cell(info) {
					if (info.row.original.powerType === "produces") {
						return "";
					}
					return formatNumber(info.getValue() ?? 0, "MW");
				},
				footer() {
					return formatNumber(totalPowerConsumption, "MW");
				},
			}),
			columnHelper.accessor("basePower", {
				id: "basePowerRemaining",
				header: "Remaining",
				meta: {
					cellCls: "text-right",
					columnWidth: "min-w-auto",
					footerCls: () => "text-right",
				},
				cell() {
					return "";
				},
				footer() {
					return formatNumber(totalPowerProduced - totalPowerConsumption, "MW");
				},
			}),
		] as ColumnDef<IMachinePower>[]);
		setSorting([{
			id: "basePowerProduced",
			desc: true,
		}, {
			id: "name",
			desc: false,
		}]);
	}, [
		data,
		dispatch,
		onClickEditGenerator,
		totalPowerProduced,
		totalPowerConsumption,
	]);

	return (
		<>
			<TableData
				table={table}
				showSummary={true}
			/>
			<Outlet />
		</>
	);
}
