import { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate } from "@tanstack/react-router";
import {
	createColumnHelper,
	getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { version } from "@/../package.json";
import { deleteFactoryThunk,
	getActiveFactory,
	getFactories,
	loadFactoriesThunk,
	setActiveFactory } from "@/api/factories.ts";
import {
	clearInventoryThunk, downloadInventory,
	getInventory,
	loadInventory,
} from "@/api/inventory.ts";
import { BaseButton } from "@/components/BaseButton.tsx";
import { BaseDropdown } from "@/components/BaseDropdown.tsx";
import { BaseMenuItem } from "@/components/BaseMenuItem.tsx";
import { ComboBox, TComboBoxValue } from "@/components/ComboBox.tsx";
import { FieldText } from "@/components/FieldText.tsx";
import { IconAdd, IconDelete, IconDownload, IconEdit, IconImport, IconRevert } from "@/components/Icons.tsx";
import { TableData } from "@/components/TableData.tsx";
import { RouteViewItem } from "@/routes.ts";
import { useAppDispatch, useAppSelector } from "@/store.ts";
import { IInventoryItem } from "@/types.ts";
import { ItemName } from "@/views/shared/CellItem.tsx";
import { ViewFactory } from "@/views/ViewFactory.tsx";
import { ViewImport } from "@/views/ViewImport.tsx";

const columnHelper = createColumnHelper<IInventoryItem>();

export function ViewInventoryItems() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const factories = useAppSelector(getFactories);
	const activeFactory = useAppSelector(getActiveFactory);
	const [factoryDialogName, setFactoryDialogName] = useState<string | undefined>("");
	const [showFactoryDialog, setShowFactoryDialog] = useState(false);
	const [showImportDialog, setShowImportDialog] = useState(false);
	const [isEditFactory, setIsEditFactory] = useState(false);
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
	const [search, setSearch] = useState<string | undefined>("");
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
	const reloadInventory = useCallback(() => {
		if (activeFactory) {
			dispatch(loadInventory(activeFactory));
		}
	}, [dispatch, activeFactory]);

	function onChangeSearch(searchValue: string) {
		table.setGlobalFilter(searchValue);
	}

	function onClickClearData() {
		dispatch(clearInventoryThunk());
	}

	function onClickDownloadData() {
		dispatch(downloadInventory());
	}

	function onClickImportData() {
		setShowImportDialog(true);
	}

	function onSetFactory(factoryId?: TComboBoxValue) {
		dispatch(setActiveFactory(factoryId as string));
	}

	function onClickEditFactory() {
		setFactoryDialogName(activeFactory?.name);
		setIsEditFactory(true);
		setShowFactoryDialog(true);
	}

	function onClickAddFactory() {
		setFactoryDialogName("");
		setIsEditFactory(false);
		setShowFactoryDialog(true);
	}

	function onClickDeleteFactory() {
		if (activeFactory) {
			dispatch(deleteFactoryThunk(activeFactory));
		}
	}

	useEffect(() => {
		dispatch(loadFactoriesThunk());
	}, [dispatch]);

	useEffect(() => {
		if (activeFactory) {
			reloadInventory();
		}
	}, [activeFactory, reloadInventory]);

	return (
		<article className="size-full flex flex-col space-y-2">
			<h2 className="font-semibold text-xl mb-4">
				<a
					href="https://store.steampowered.com/app/526870/Satisfactory/"
					className="link"
					target="_blank"
				>
					Satisfactory
				</a>
				{" "}
				<span>
					Production Manager
					<a
						className="link ml-1"
						href="https://github.com/incutonez/satisfactory-manager/blob/main/CHANGELOG.md"
						target="_blank"
					>
						v
						{version}
					</a>
				</span>
			</h2>
			<section className="flex">
				<section className="flex space-x-2">
					<ComboBox
						label="Factory"
						value={activeFactory?.id ?? ""}
						options={factories}
						valueField="id"
						displayField="name"
						setValue={onSetFactory}
					/>
					<BaseDropdown>
						<BaseMenuItem
							icon={IconEdit}
							text="Edit"
							onAction={onClickEditFactory}
						/>
						<BaseMenuItem
							text="Delete"
							icon={IconDelete}
							onAction={onClickDeleteFactory}
							isDisabled={factories?.length <= 1}
						/>
						<BaseMenuItem
							text="Clear"
							icon={IconRevert}
							onAction={onClickClearData}
						/>
						<BaseMenuItem
							text="Download"
							icon={IconDownload}
							onAction={onClickDownloadData}
						/>
						<BaseMenuItem
							text="Import"
							icon={IconImport}
							onAction={onClickImportData}
						/>
					</BaseDropdown>
					<BaseButton
						text="Factory"
						title="Add New Factory"
						icon={IconAdd}
						onClick={onClickAddFactory}
					/>
				</section>
				<section className="ml-auto flex space-x-2">
					<FieldText
						value={search}
						setter={setSearch}
						label="Search"
						placeholder="Search..."
						onInputChange={onChangeSearch}
					/>
				</section>
			</section>
			<TableData<IInventoryItem>
				table={table}
			/>
			<ViewFactory
				isEdit={isEditFactory}
				factoryName={factoryDialogName}
				show={showFactoryDialog}
				setShow={setShowFactoryDialog}
			/>
			<ViewImport
				show={showImportDialog}
				setShow={setShowImportDialog}
			/>
			<Outlet />
		</article>
	);
}
