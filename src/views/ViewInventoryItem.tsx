import { useCallback, useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate, useParams } from "@tanstack/react-router";
import { ColumnDef, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { deleteItemRecipe, getActiveItem, getActiveItemRecipes } from "@/api/activeItem.ts";
import { resetDraftInventory, saveInventoryThunk } from "@/api/inventory.ts";
import { BaseButton } from "@/components/BaseButton.tsx";
import { BaseDialog, IBaseDialog } from "@/components/BaseDialog.tsx";
import { IconAdd, IconDelete, IconEdit, IconSave } from "@/components/Icons.tsx";
import { TableData } from "@/components/TableData.tsx";
import { RouteCreate, RouteViewItem, RouteViewItems, RouteViewRecipe } from "@/routes.ts";
import { useAppDispatch, useAppSelector } from "@/store.ts";
import { IInventoryRecipe, IRecipeItem, TRecipeType } from "@/types.ts";

export interface IViewItem extends IBaseDialog {
	recipeType?: TRecipeType;
}

export function ViewInventoryItem({ show }: IViewItem) {
	const { recipeType, itemId } = useParams({
		from: RouteViewItem,
	});
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const record = useAppSelector(getActiveItem);
	const records = useAppSelector(getActiveItemRecipes);
	const [data, setData] = useState<IInventoryRecipe[]>(records ?? []);
	const [columns, setColumns] = useState<ColumnDef<IInventoryRecipe>[]>([]);
	const [sorting, setSorting] = useState<SortingState>([]);
	const showAllRecipes = useMemo(() => recipeType === "both", [recipeType]);
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		state: {
			sorting,
		},
	});
	const viewRecipe = useCallback((recipeId: string) => {
		navigate({
			to: RouteViewRecipe,
			params: {
				recipeType,
				itemId,
				recipeId,
			},
		});
	}, [navigate, recipeType, itemId]);
	const onClickEditRecipe = useCallback(({ id }: IInventoryRecipe) => {
		viewRecipe(id);
	}, [viewRecipe]);

	function setShow(show: boolean) {
		if (!show) {
			dispatch(resetDraftInventory());
			viewInventory();
		}
	}

	function viewInventory() {
		navigate({
			to: RouteViewItems,
		});
	}

	function onClickSave() {
		if (record) {
			dispatch(saveInventoryThunk());
			viewInventory();
		}
	}

	useEffect(() => {
		if (records) {
			const recordId = record?.id;
			if (showAllRecipes) {
				setData(records);
			}
			else {
				setData(records.filter(({ items }) => items.filter((item) => item.recipeType === recipeType && item.itemId === recordId).length));
			}
		}
	}, [showAllRecipes, records, recipeType, record?.id]);

	useEffect(() => {
		const recordId = record?.id;
		const columnDefs: ColumnDef<IInventoryRecipe>[] = [{
			id: "actions",
			meta: {
				cellCls: "flex justify-center space-x-2",
				columnWidth: "min-w-auto",
			},
			cell(info) {
				return (
					<>
						<BaseButton
							icon={IconDelete}
							title="Delete Recipe"
							onClick={() => dispatch(deleteItemRecipe(info.row.original))}
						/>
						<BaseButton
							icon={IconEdit}
							title="Edit Recipe"
							onClick={() => onClickEditRecipe(info.row.original)}
						/>
					</>
				);
			},
		}, {
			header: "Recipe",
			accessorKey: "recipeName",
			cell: (info) => info.getValue(),
		}, {
			header: "Overclock",
			accessorKey: "overclockValue",
			cell: (info) => `${info.getValue()}%`,
			meta: {
				cellCls: "text-center",
				columnWidth: "min-w-auto",
			},
		}, {
			header: "Somersloop",
			accessorKey: "somersloopValue",
			cell: (info) => info.getValue(),
			meta: {
				cellCls: "text-center",
				columnWidth: "min-w-auto",
			},
		}, {
			header: "Machine Count",
			accessorKey: "machineCount",
			cell: (info) => info.getValue(),
			meta: {
				cellCls: "text-center",
				columnWidth: "min-w-auto",
			},
		}];
		if (showAllRecipes || recipeType === "produces") {
			columnDefs.push({
				header: "Produces",
				id: "produces_items",
				accessorKey: "items",
				meta: {
					cellCls: "text-center",
					columnWidth: "min-w-auto",
				},
				cell(info) {
					const value = info.getValue<IRecipeItem[]>();
					const found = value.find((item) => item.itemId === recordId && item.recipeType === "produces");
					if (!found) {
						return "-";
					}
					return (
						<span>
							{found.amountPerMinuteDisplay}
						</span>
					);
				},
				footer: () => record?.producingTotal || "-",
			});
		}
		if (showAllRecipes || recipeType === "consumes") {
			columnDefs.push({
				header: "Consumes",
				id: "consumes_items",
				accessorKey: "items",
				meta: {
					cellCls: "text-center",
					columnWidth: "min-w-auto",
				},
				cell(info) {
					const value = info.getValue<IRecipeItem[]>();
					const found = value.find((item) => item.itemId === recordId && item.recipeType === "consumes");
					if (!found) {
						return "-";
					}
					return (
						<span>
							{found.amountPerMinuteDisplay}
						</span>
					);
				},
				footer: () => record?.consumingTotal || "-",
			});
		}
		if (showAllRecipes) {
			columnDefs.push({
				header: "Remaining",
				meta: {
					cellCls: "text-center",
					columnWidth: "min-w-auto",
					footerCls() {
						if (!record) {
							return "";
						}
						const total = record.producingTotal - record.consumingTotal;
						if (total > 0) {
							return "bg-positive";
						}
						else if (total < 0) {
							return "bg-negative";
						}
						else if (record.producingTotal) {
							return "bg-zero";
						}
						return "";
					},
				},
				footer() {
					if (!record) {
						return "-";
					}
					return record.producingTotal - record.consumingTotal;
				},
			});
		}
		setColumns(columnDefs);
		setSorting([{
			id: "recipeName",
			desc: false,
		}]);
	}, [
		onClickEditRecipe,
		showAllRecipes,
		recipeType,
		setColumns,
		record,
		dispatch,
	]);

	if (!record) {
		return;
	}
	let title = "Total";
	if (recipeType === "produces") {
		title = "Production";
	}
	else if (recipeType === "consumes") {
		title = "Consumption";
	}
	title = `${title}: ${record.name}`;
	const footerButtons = (
		<BaseButton
			text="Save"
			icon={IconSave}
			onClick={onClickSave}
		/>
	);

	function onClickAddRecipe() {
		viewRecipe(RouteCreate);
	}

	return (
		<>
			<BaseDialog
				title={title}
				show={show}
				setShow={setShow}
				footerSlot={footerButtons}
			>
				<article className="flex flex-col h-full space-y-4">
					<section className="flex space-x-4 items-center">
						<BaseButton
							title="Add Recipe"
							text="Recipe"
							icon={IconAdd}
							onClick={onClickAddRecipe}
						/>
					</section>
					<TableData
						table={table}
						showSummary={true}
					/>
				</article>
			</BaseDialog>
			<Outlet />
		</>
	);
}
