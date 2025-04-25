import { useEffect, useState } from "react";
import {
	ColumnDef,
	createColumnHelper,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel, SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { getPowerConsumption, getPowerItems } from "@/api/inventory.ts";
import { TableData } from "@/components/TableData.tsx";
import { useAppSelector } from "@/store.ts";
import { IInventoryRecipe } from "@/types.ts";

const columnHelper = createColumnHelper<IInventoryRecipe>();

// TODOJEF: PICK UP HERE... need to add ability to set power machines
// Also need to add editing the recipes inline, maybe?
export function ViewFactoryPower() {
	const data = useAppSelector(getPowerItems);
	const totalPowerConsumption = useAppSelector(getPowerConsumption);
	const [columns, setColumns] = useState<ColumnDef<IInventoryRecipe>[]>([]);
	const [globalFilter, setGlobalFilter] = useState<string>();
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

	useEffect(() => {
		setColumns([
			columnHelper.accessor("recipeName", {
				header: "Recipe",
			}),
			columnHelper.accessor("overclockValue", {
				header: "Overclock %",
				meta: {
					cellCls: "text-center",
					columnWidth: "min-w-auto",
				},
			}),
			columnHelper.accessor("somersloopValue", {
				header: "Somersloop",
				meta: {
					cellCls: "text-center",
					columnWidth: "min-w-auto",
				},
			}),
			columnHelper.accessor("machineCount", {
				header: "Machines",
				meta: {
					cellCls: "text-center",
					columnWidth: "min-w-auto",
				},
			}),
			columnHelper.accessor("powerConsumption", {
				header: "MW Consumed",
				meta: {
					cellCls: "text-center",
					columnWidth: "min-w-auto",
				},
				footer() {
					return totalPowerConsumption;
				},
			}),
		] as ColumnDef<IInventoryRecipe>[]);
		setSorting([{
			id: "recipeName",
			desc: false,
		}]);
	}, [data, totalPowerConsumption]);

	return (
		<TableData
			table={table}
			showSummary={true}
		/>
	);
}
