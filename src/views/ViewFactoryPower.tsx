import { useEffect, useState } from "react";
import {
	ColumnDef,
	createColumnHelper,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel, SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { round } from "mathjs";
import { getInventoryRecipes } from "@/api/inventory.ts";
import { TableData } from "@/components/TableData.tsx";
import { useAppSelector } from "@/store.ts";
import { IInventoryRecipe } from "@/types.ts";

const columnHelper = createColumnHelper<IInventoryRecipe>();

export function ViewFactoryPower() {
	const data = useAppSelector(getInventoryRecipes);
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
					return round(data.reduce((total, item) => total + (item.powerConsumption ?? 0), 0), 2);
				},
			}),
		] as ColumnDef<IInventoryRecipe>[]);
		setSorting([{
			id: "recipeName",
			desc: false,
		}]);
	}, [data]);

	return (
		<TableData
			table={table}
			showSummary={true}
		/>
	);
}
