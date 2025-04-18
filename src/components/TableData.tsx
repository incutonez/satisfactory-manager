import { ReactNode } from "react";
import { Cell, flexRender, Header, Table } from "@tanstack/react-table";
import classNames from "classnames";
import { IconSort } from "@/components/Icons.tsx";

export interface ITableData<TData = unknown> {
	table: Table<TData>;
	hideHeaders?: boolean;
	showSummary?: boolean;
}

const DefaultCellCls = "border-r border-b last:border-r-0 px-2 py-1";

export function TableData<TData = unknown>({ table, showSummary = false, hideHeaders = false }: ITableData<TData>) {
	let footerNodes;
	const tableCls = classNames("border-spacing-0 border-separate w-full border-x", hideHeaders ? "border-t" : "");
	const tableHeaders = !hideHeaders && table.getHeaderGroups().map((headerGroup) => {
		const rows = headerGroup.headers.map((header) => {
			const { column } = header;
			let title = "";
			let sortIcon: ReactNode;
			if (column.getCanSort()) {
				const sortDir = column.getIsSorted();
				switch (column.getNextSortingOrder()) {
					case "asc":
						title = "Sort Ascending";
						break;
					case "desc":
						title = "Sort Descending";
						break;
					default:
						title = "Clear Sort";
				}
				if (sortDir) {
					const sortCls = ["size-6"];
					if (sortDir === "asc") {
						sortCls.push("rotate-180 -scale-x-90");
					}
					sortIcon = (
						<div className="absolute right-2 top-2">
							<IconSort className={sortCls.join(" ")} />
						</div>
					);
				}
			}
			return (
				<th
					key={header.id}
					className={getHeaderClass(header)}
					onClick={column.getToggleSortingHandler()}
					title={title}
				>
					<span>
						{flexRender(header.column.columnDef.header, header.getContext())}
					</span>
					{sortIcon}
				</th>
			);
		});
		return (
			<tr key={headerGroup.id}>
				{rows}
			</tr>
		);
	});
	const rowNodes = table.getRowModel().rows.map((row) => {
		const cellNodes = row.getVisibleCells().map((cell) => {
			function onClickCellHandler() {
				const onClickCell = cell.column.columnDef.meta?.onClickCell;
				if (onClickCell) {
					onClickCell(cell);
				}
			}
			return (
				<td
					key={cell.id}
					className={getCellClass(cell)}
					onClick={onClickCellHandler}
				>
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</td>
			);
		});
		return (
			<tr key={row.id}>
				{cellNodes}
			</tr>
		);
	});
	if (showSummary) {
		footerNodes = table.getFooterGroups().map((footerGroup) => {
			return (
				<tr key={footerGroup.id}>
					{footerGroup.headers.map((header) => (
						<th
							key={header.id}
							className={getFooterClass(header)}
						>
							{header.isPlaceholder
								? null
								: flexRender(header.column.columnDef.footer, header.getContext())}
						</th>
					))}
				</tr>
			);
		});
		footerNodes = (
			<tfoot>
				{footerNodes}
			</tfoot>
		);
	}

	function getHeaderClass(header: Header<TData, unknown>) {
		const cls = ["z-1 p-2 border-r last:border-r-0 border-b border-t sticky top-0", header.column.columnDef.meta?.columnWidth ?? "min-w-64"];
		if (header.column.getCanSort()) {
			cls.push("cursor-pointer select-none hover:bg-blue-300");
		}
		if (header.column.getIsSorted()) {
			cls.push("bg-blue-400");
		}
		else {
			cls.push("bg-gray-300");
		}
		return cls.join(" ");
	}

	function getFooterClass(header: Header<TData, unknown>) {
		const meta = header.column.columnDef.meta;
		const cls = ["z-1 p-2 border-r last:border-r-0 border-b border-t sticky bottom-0 bg-stone-200", meta?.columnWidth ?? "min-w-64"];
		if (meta?.footerCls) {
			cls.push(meta.footerCls(header));
		}
		return cls.join(" ");
	}

	function getCellClass(cell: Cell<TData, unknown>) {
		const cls = [DefaultCellCls];
		const { column } = cell;
		const { meta } = column.columnDef;
		if (column.id === "total") {
			const value = cell.getValue<number>();
			if (value < 0) {
				cls.push("bg-red-200");
			}
			else if (value > 0) {
				cls.push("bg-green-200");
			}
			else {
				cls.push("bg-white");
			}
		}
		else {
			cls.push("bg-white");
		}
		if (meta) {
			if (meta.cellCls) {
				cls.push(meta.cellCls);
			}
			if (meta.onClickCell) {
				cls.push("cursor-pointer hover:bg-blue-200");
			}
		}
		return cls.join(" ");
	}

	return (
		<article className="overflow-auto flex-1">
			<table className={tableCls}>
				<thead>
					{tableHeaders}
				</thead>
				<tbody>
					{rowNodes}
				</tbody>
				{footerNodes}
			</table>
		</article>
	);
}
