import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "@tanstack/react-router";
import {
	createColumnHelper,
	getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { getCurrentSearch } from "@/api/activeItem.ts";
import { getInventory } from "@/api/inventory.ts";
import { TableData } from "@/components/TableData.tsx";
import { RouteViewItem } from "@/routes.ts";
import { useAppSelector } from "@/store.ts";
import { IInventoryItem } from "@/types.ts";
import { ItemName } from "@/views/shared/CellItem.tsx";

const columnHelper = createColumnHelper<IInventoryItem>();

export function ViewInventoryItems() {
	const navigate = useNavigate();
	const search = useAppSelector(getCurrentSearch);
	const [columns] = useState([columnHelper.accessor("name", {
		header: "Name",
		cell: (info) => <ItemName cell={info.cell} />,
	}), columnHelper.accessor("producingTotal", {
		header: "Producing",
		cell: (info) => info.getValue(),
		meta: {
			cellCls: "text-right",
			onClickCell(cell) {
				navigate({
					to: RouteViewItem,
					params: {
						itemId: cell.row.original.id,
						recipeType: "produces",
					},
				});
			},
		},
	}), columnHelper.accessor("consumingTotal", {
		header: "Consuming",
		cell: (info) => info.getValue(),
		meta: {
			cellCls: "text-right",
			onClickCell(cell) {
				navigate({
					to: RouteViewItem,
					params: {
						itemId: cell.row.original.id,
						recipeType: "consumes",
					},
				});
			},
		},
	}), columnHelper.accessor("total", {
		header: "Total",
		cell: (info) => info.getValue(),
		meta: {
			cellCls(cell) {
				const cls = ["text-right"];
				const value = cell.getValue<number>();
				const hasValue = cell.row.original.consumingTotal;
				if (value < 0) {
					cls.push("bg-negative");
				}
				else if (value > 0) {
					cls.push("bg-positive");
				}
				else if (hasValue) {
					cls.push("bg-zero");
				}
				return cls.join(" ");
			},
			onClickCell(cell) {
				navigate({
					to: RouteViewItem,
					params: {
						itemId: cell.row.original.id,
						recipeType: "both",
					},
				});
			},
		},
	})]);
	const [globalFilter, setGlobalFilter] = useState<string>();
	const data = useAppSelector(getInventory);
	const [sorting, setSorting] = useState<SortingState>([{
		id: "name",
		desc: false,
	}]);
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
		setGlobalFilter(search);
	}, [search]);

	return (
		<>
			<TableData table={table} />
			<Outlet />
		</>
	);
}
