/// <reference types="vite-plugin-svgr/client" />
/// <reference types="vite/client" />
import { Cell, Header, RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
	interface ColumnMeta<TData extends RowData, TValue> {
		cellCls?: string
		footerCls?: (header: Header<TData, unknown>) => string;
		columnWidth?: string;
		canClick?: boolean;
		onClickCell?: (cell: Cell<TData, unknown>) => void;
	}
}
