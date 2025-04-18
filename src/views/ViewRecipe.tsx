import { useEffect, useState } from "react";
import { recipes } from "@/api/recipes.ts";
import { BaseButton } from "@/components/BaseButton.tsx";
import { BaseDialog, IBaseDialog } from "@/components/BaseDialog.tsx";
import { RecipeMachine } from "@/components/CellItem.tsx";
import { ComboBox, TComboBoxValue } from "@/components/ComboBox.tsx";
import { FieldDisplay } from "@/components/FieldDisplay.tsx";
import { FieldNumber } from "@/components/FieldNumber.tsx";
import { IconSave } from "@/components/Icons.tsx";
import { RecipeItems } from "@/components/RecipeItems.tsx";
import { IInventoryRecipe, IRecipe, TItemKey, TRecipeType } from "@/types.ts";
import { clone, uuid } from "@/utils/common.ts";

export interface IViewRecipe extends IBaseDialog {
	record?: IInventoryRecipe;
	recipeType?: TRecipeType;
	highlightItem: TItemKey;
	onSave: (recipe: IInventoryRecipe) => void;
}

export function ViewRecipe({ show, setShow, onSave, record, recipeType, highlightItem }: IViewRecipe) {
	let recipeNode;
	const [availableRecipes, setAvailableRecipes] = useState<IRecipe[]>(recipes);
	const [recipe, setRecipe] = useState<TComboBoxValue>(record?.recipeId ?? "");
	const [recipeRecord, setRecipeRecord] = useState<IRecipe>();
	const [overclock, setOverclock] = useState<number>(record?.overclockValue ?? 100);
	const [somersloop, setSomersloop] = useState<number>(record?.somersloopValue ?? 0);
	const [machineCount, setMachineCount] = useState<number>(record?.machineCount ?? 1);
	const footerNode = (
		<BaseButton
			text="Save"
			icon={IconSave}
			disabled={!recipeRecord}
			onClick={onClickSave}
		/>
	);
	if (recipeRecord) {
		recipeNode = (
			<section className="flex flex-col space-y-4 flex-1">
				<section className="flex space-x-4 items-start">
					<section className="flex flex-col space-y-2">
						<FieldDisplay
							label="Cycle Time (seconds)"
							value={recipeRecord.productionCycleTime}
						/>
						<FieldDisplay
							label="Cycles / Min"
							value={recipeRecord.cyclesPerMinute}
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
						items={recipeRecord.items}
						recipeType="consumes"
						highlightItem={highlightItem}
						machineCount={machineCount}
						overclock={overclock}
						somersloop={somersloop}
					/>
					<RecipeMachine record={record} />
					<RecipeItems
						items={recipeRecord.items}
						recipeType="produces"
						highlightItem={highlightItem}
						machineCount={machineCount}
						overclock={overclock}
						somersloop={somersloop}
					/>
				</section>
			</section>
		);
	}

	function onClickSave() {
		if (recipeRecord) {
			onSave({
				machineCount,
				recipeId: recipeRecord.id,
				recipeName: recipeRecord.name,
				cyclesPerMinute: recipeRecord.cyclesPerMinute,
				isAlternate: recipeRecord.isAlternate,
				items: clone(recipeRecord.items),
				producedIn: clone(recipeRecord.producedIn),
				productionCycleTime: recipeRecord.productionCycleTime,
				id: record?.id || uuid(),
				overclockValue: overclock,
				somersloopValue: somersloop,
			});
			setShow(false);
		}
	}

	useEffect(() => {
		setAvailableRecipes(recipes.filter((recipe) => {
			return recipe.items.find((produce) => {
				if (recipeType) {
					return produce.itemId === highlightItem && produce.recipeType === recipeType;
				}
				// We're in the total view here, and we want all combined recipes
				return produce.itemId === highlightItem;
			});
		}));
	}, [recipeType, setAvailableRecipes, highlightItem]);

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
				{recipeNode}
			</article>
		</BaseDialog>
	);
}
