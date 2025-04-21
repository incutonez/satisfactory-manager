import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getActiveItemRecipe, saveItemThunk } from "@/api/activeItem.ts";
import { recipes } from "@/api/recipes.ts";
import { BaseButton, IBaseButton } from "@/components/BaseButton.tsx";
import { BaseDialog, IBaseDialog } from "@/components/BaseDialog.tsx";
import { RecipeMachine } from "@/components/CellItem.tsx";
import { ComboBox, TComboBoxValue } from "@/components/ComboBox.tsx";
import { FieldDisplay } from "@/components/FieldDisplay.tsx";
import { FieldNumber } from "@/components/FieldNumber.tsx";
import { IconSave } from "@/components/Icons.tsx";
import { RecipeItems } from "@/components/RecipeItems.tsx";
import { RouteViewItem } from "@/routes.ts";
import { useAppDispatch, useAppSelector } from "@/store.ts";
import { IRecipe, TItemKey, TRecipeType } from "@/types.ts";
import { calculateSomersloop } from "@/utils/common.ts";

export interface IViewRecipe extends IBaseDialog {
	recipeId?: string;
	recipeType: TRecipeType;
	itemId: TItemKey;
}

export interface IViewRecipeSave extends IBaseButton {
	record?: IRecipe;
}

export interface IViewRecipeItems {
	record?: IRecipe;
	recipeId?: string;
	itemId?: TItemKey;
	overclock: number;
	setOverclock: Dispatch<SetStateAction<number>>;
	somersloop: number;
	setSomersloop: Dispatch<SetStateAction<number>>;
	machineCount: number;
	setMachineCount: Dispatch<SetStateAction<number>>;
}

export function ViewRecipeSave({ record, ...props }: IViewRecipeSave) {
	return (
		<BaseButton
			text="Save"
			icon={IconSave}
			isDisabled={!record}
			{...props}
		/>
	);
}

export function ViewRecipeItems({ record, recipeId, overclock, setOverclock, somersloop, setSomersloop, machineCount, setMachineCount, itemId }: IViewRecipeItems) {
	const overclockValue = useMemo(() => overclock / 100, [overclock]);
	if (!record) {
		return;
	}

	return (
		<section className="flex flex-col space-y-4 flex-1">
			<section className="flex space-x-4 items-start">
				<section className="flex flex-col space-y-2">
					<FieldDisplay
						label="Cycle Time (seconds)"
						value={record.productionCycleTime}
					/>
					<FieldDisplay
						label="Cycles / Min"
						value={record.cyclesPerMinute}
					/>
				</section>
				<section className="flex flex-col space-y-2">
					<FieldNumber
						label="Overclock %"
						min={0}
						max={250}
						inputWidth="w-16"
						labelCls="w-26"
						setter={(value = 100) => setOverclock(value)}
						value={overclock}
					/>
					<FieldNumber
						label="Somersloop"
						min={0}
						max={4}
						inputWidth="w-16"
						labelCls="w-26"
						setter={(value = 0) => setSomersloop(value)}
						value={somersloop}
					/>
				</section>
				<FieldNumber
					label="Machines"
					min={1}
					inputWidth="w-16"
					setter={(value = 1) => setMachineCount(value)}
					value={machineCount}
				/>
			</section>
			<section className="flex items-center justify-center space-x-4 flex-1">
				<RecipeItems
					items={record.items}
					recipeId={recipeId}
					recipeType="consumes"
					highlightItem={itemId}
					multiplier={overclockValue * machineCount}
				/>
				<RecipeMachine record={record} />
				<RecipeItems
					items={record.items}
					recipeId={recipeId}
					recipeType="produces"
					highlightItem={itemId}
					multiplier={overclockValue * machineCount * calculateSomersloop(somersloop, "produces")}
				/>
			</section>
		</section>
	);
}

export function ViewRecipe({ recipeId, recipeType, itemId, show }: IViewRecipe) {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [availableRecipes, setAvailableRecipes] = useState<IRecipe[]>(recipes);
	const [recipe, setRecipe] = useState<TComboBoxValue>(itemId ?? "");
	const [recipeRecord, setRecipeRecord] = useState<IRecipe>();
	const activeItemRecipe = useAppSelector((state) => getActiveItemRecipe(state, recipeId));
	const [overclock, setOverclock] = useState(activeItemRecipe?.overclockValue ?? 100);
	const [somersloop, setSomersloop] = useState(activeItemRecipe?.somersloopValue ?? 0);
	const [machineCount, setMachineCount] = useState(activeItemRecipe?.machineCount ?? 1);
	const footerNode = (
		<ViewRecipeSave
			record={recipeRecord}
			onClick={onClickSave}
		/>
	);

	function viewItem() {
		navigate({
			to: RouteViewItem,
			params: {
				recipeType,
				itemId,
			},
		});
	}

	function setShow(show: boolean) {
		if (!show) {
			viewItem();
		}
	}

	function onClickSave() {
		if (recipeRecord) {
			dispatch(saveItemThunk({
				machineCount,
				recipeRecord,
				activeItemRecipe,
				overclock,
				somersloop,
			}));
			viewItem();
		}
	}

	useEffect(() => {
		if (activeItemRecipe) {
			setOverclock(activeItemRecipe.overclockValue);
			setSomersloop(activeItemRecipe.somersloopValue);
			setMachineCount(activeItemRecipe.machineCount);
			setRecipe(activeItemRecipe.recipeId);
		}
	}, [activeItemRecipe, setRecipe]);

	useEffect(() => {
		const showAllRecipes = recipeType === "both";
		setAvailableRecipes(recipes.filter((recipe) => {
			return recipe.items.find((produce) => {
				if (showAllRecipes) {
					// We're in the total view here, and we want all combined recipes
					return produce.itemId === itemId;
				}
				return produce.itemId === itemId && produce.recipeType === recipeType;
			});
		}));
	}, [recipeType, setAvailableRecipes, itemId]);

	return (
		<BaseDialog
			title="Edit Recipe"
			show={show}
			setShow={setShow}
			footerSlot={footerNode}
		>
			<article className="flex h-full flex-col space-y-4">
				<ComboBox
					label="Recipe"
					value={recipe}
					setValue={setRecipe}
					setSelection={setRecipeRecord}
					options={availableRecipes}
					valueField="id"
					displayField="name"
					inputCls="w-68"
				/>
				<ViewRecipeItems
					itemId={itemId}
					recipeId={recipeId}
					record={recipeRecord}
					overclock={overclock}
					setOverclock={setOverclock}
					somersloop={somersloop}
					setSomersloop={setSomersloop}
					machineCount={machineCount}
					setMachineCount={setMachineCount}
				/>
			</article>
		</BaseDialog>
	);
}
