import { useCallback, useEffect, useState } from "react";
import {
	createColumnHelper,
	getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState,
	useReactTable,
} from "@tanstack/react-table";
import {
	addFactoryThunk, deleteFactoryThunk,
	getActiveFactory,
	getFactories,
	IFactory,
	loadFactories,
	setActiveFactory,
	setActiveFactoryName,
} from "@/api/factories.ts";
import {
	addRecipe,
	deleteRecipe, getActiveItem, getInventory,
	loadInventory,
	saveInventory,
	setActiveItem, updateRecipe,
} from "@/api/inventory.ts";
import { BaseButton } from "@/components/BaseButton.tsx";
import { BaseDialog } from "@/components/BaseDialog.tsx";
import { ItemName } from "@/components/CellItem.tsx";
import { ComboBox, TComboBoxValue } from "@/components/ComboBox.tsx";
import { FieldText } from "@/components/FieldText.tsx";
import { IconAdd, IconDelete, IconEdit, IconRevert, IconSave } from "@/components/Icons.tsx";
import { TableData } from "@/components/TableData.tsx";
import { useAppDispatch, useAppSelector } from "@/store.ts";
import { IInventoryItem, TRecipeType } from "@/types.ts";
import { uuid } from "@/utils/common.ts";
import { ViewInventoryItem } from "@/views/ViewInventoryItem.tsx";

const columnHelper = createColumnHelper<IInventoryItem>();

export function ViewInventoryItems() {
	let itemDialogNode;
	const dispatch = useAppDispatch();
	const factories = useAppSelector(getFactories);
	const activeFactory = useAppSelector(getActiveFactory);
	const [factoryDialogName, setFactoryDialogName] = useState<string | undefined>("");
	const [showFactoryDialog, setShowFactoryDialog] = useState(false);
	const [isEditFactory, setIsEditFactory] = useState(false);
	const factoryDialogFooter = (
		<BaseButton
			text="Save"
			icon={IconSave}
			disabled={!factoryDialogName}
			onClick={onClickSaveFactory}
		/>
	);
	const [columns] = useState([columnHelper.accessor("name", {
		header: "Name",
		cell: (info) => <ItemName cell={info.cell} />,
	}), columnHelper.accessor("producingTotal", {
		header: "Producing",
		cell: (info) => info.getValue(),
		meta: {
			cellCls: "text-right",
			onClickCell(cell) {
				dispatch(setActiveItem(cell.row.original));
				setRecipeType("produces");
				setShowItemDialog(true);
			},
		},
	}), columnHelper.accessor("consumingTotal", {
		header: "Consuming",
		cell: (info) => info.getValue(),
		meta: {
			cellCls: "text-right",
			onClickCell(cell) {
				dispatch(setActiveItem(cell.row.original));
				setRecipeType("consumes");
				setShowItemDialog(true);
			},
		},
	}), columnHelper.accessor("total", {
		header: "Total",
		cell: (info) => info.getValue(),
		meta: {
			cellCls: "text-right",
			onClickCell(cell) {
				dispatch(setActiveItem(cell.row.original));
				setRecipeType(undefined);
				setShowItemDialog(true);
			},
		},
	})]);
	const [search, setSearch] = useState<string | undefined>("");
	const [recipeType, setRecipeType] = useState<TRecipeType>();
	const [globalFilter, setGlobalFilter] = useState<string>();
	const [showItemDialog, setShowItemDialog] = useState(false);
	const data = useAppSelector(getInventory);
	const activeCell = useAppSelector(getActiveItem);
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

	if (showItemDialog && activeCell) {
		itemDialogNode = (
			<ViewInventoryItem
				recipeType={recipeType}
				show={showItemDialog}
				setShow={setShowItemDialog}
				onClickSave={onClickSave}
			/>
		);
	}

	function saveFactory() {
		if (!factoryDialogName) {
			return;
		}
		if (isEditFactory) {
			dispatch(setActiveFactoryName({
				name: factoryDialogName,
				id: activeFactory!.id,
			}));
		}
		else {
			dispatch(addFactoryThunk({
				id: uuid(),
				name: factoryDialogName,
			}));
		}
		setShowFactoryDialog(false);
	}

	function onChangeSearch(searchValue: string) {
		table.setGlobalFilter(searchValue);
	}

	function onClickSave(updateRecord: IInventoryItem) {
		// This gets the previous state of our record
		const found = data.find((item) => item.id === updateRecord.id)!;
		const previousItems = found.recipes;
		const updatedItems = updateRecord.recipes;
		previousItems.forEach((item) => {
			const { id } = item;
			if (!updatedItems.find((recipe) => recipe.id === id)) {
				dispatch(deleteRecipe(item));
			}
		});
		for (const item of updatedItems) {
			const { id } = item;
			const foundPreviousItem = previousItems.find((previousItem) => previousItem.id === id);
			// No changes, skip
			if (foundPreviousItem === item) {
				continue;
			}
			// Already exists but has changes
			else if (foundPreviousItem) {
				dispatch(updateRecipe(item));
			}
			// Not found, new record
			else {
				dispatch(addRecipe(item));
			}
		}
		dispatch(saveInventory(false));
		reloadInventory();
		setShowItemDialog(false);
	}

	function onClickClearData() {
		dispatch(saveInventory(true));
		reloadInventory();
	}

	function onSetActiveFactory(factory?: IFactory) {
		dispatch(setActiveFactory(factory));
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

	function onClickSaveFactory() {
		saveFactory();
	}

	function onEnterFactory() {
		saveFactory();
	}

	useEffect(() => {
		dispatch(loadFactories());
	}, [dispatch]);

	useEffect(() => {
		if (activeFactory) {
			reloadInventory();
		}
	}, [activeFactory, reloadInventory]);

	return (
		<article className="size-full flex flex-col space-y-2">
			<section className="flex">
				<section className="flex space-x-2">
					<ComboBox
						label="Factory"
						value={activeFactory?.id ?? ""}
						options={factories}
						valueField="id"
						displayField="name"
						setValue={onSetFactory}
						setSelection={onSetActiveFactory}
					/>
					<BaseButton
						title="Add New Factory"
						icon={IconAdd}
						onClick={onClickAddFactory}
					/>
					<BaseButton
						title="Edit Factory Name"
						icon={IconEdit}
						onClick={onClickEditFactory}
					/>
					<BaseButton
						title="Delete Factory"
						icon={IconDelete}
						onClick={onClickDeleteFactory}
						disabled={factories?.length <= 1}
					/>
					<BaseButton
						title="Clear Data"
						icon={IconRevert}
						onClick={onClickClearData}
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
			{itemDialogNode}
			<BaseDialog
				title={isEditFactory ? "Edit Factory" : "Add Factory"}
				size="size-fit"
				bodyCls="p-4"
				footerSlot={factoryDialogFooter}
				show={showFactoryDialog}
				setShow={setShowFactoryDialog}
			>
				<article>
					<FieldText
						label="Name"
						autoFocus={true}
						value={factoryDialogName}
						setter={setFactoryDialogName}
						onEnter={onEnterFactory}
					/>
				</article>
			</BaseDialog>
		</article>
	);
}
