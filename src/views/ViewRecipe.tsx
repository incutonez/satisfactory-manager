import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getActiveItemRecipe, saveItemThunk } from "@/api/activeItem.ts";
import { Miners, NodeTypes, TNodeType } from "@/api/data.ts";
import { getPowerConsumption, getPowerTotal } from "@/api/inventory.ts";
import { machines, TMachine } from "@/api/machines.ts";
import { recipes } from "@/api/recipes.ts";
import { BaseButton, IBaseButton } from "@/components/BaseButton.tsx";
import { BaseDialog, IBaseDialog } from "@/components/BaseDialog.tsx";
import { ComboBox } from "@/components/ComboBox.tsx";
import { FieldDisplay } from "@/components/FieldDisplay.tsx";
import { FieldNumber } from "@/components/FieldNumber.tsx";
import { IconSave } from "@/components/Icons.tsx";
import { RouteViewItem } from "@/routes.ts";
import { useAppDispatch, useAppSelector } from "@/store.ts";
import { INodeType, IRecipe, TItemKey, TRecipeType } from "@/types.ts";
import { calculateMachinePower, calculateSomersloop, formatNumber } from "@/utils/common.ts";
import { RecipeItems } from "@/views/recipe/RecipeItems.tsx";
import { RecipeMachine } from "@/views/shared/CellItem.tsx";

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
	nodeType?: TNodeType;
	setNodeType: Dispatch<SetStateAction<TNodeType | undefined>>;
	setSelectedNodeType: Dispatch<SetStateAction<INodeType | undefined>>;
	machineId?: TMachine;
	setMachineId: Dispatch<SetStateAction<TMachine | undefined>>;
	nodeTypeMultiplier: number;
	basePower: number;
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

export function ViewRecipeItems({ record, basePower, recipeId, nodeTypeMultiplier, setSelectedNodeType, setNodeType, setMachineId, machineId, nodeType, overclock, setOverclock, somersloop, setSomersloop, machineCount, setMachineCount, itemId }: IViewRecipeItems) {
	const overclockValue = useMemo(() => overclock / 100, [overclock]);
	const totalPower = useAppSelector(getPowerTotal);
	const currentConsumption = useAppSelector(getPowerConsumption);
	const activeItemRecipe = useAppSelector((state) => getActiveItemRecipe(state, recipeId));
	const currentConsumptionAdjusted = useMemo(() => currentConsumption - calculateMachinePower({
		somersloop: activeItemRecipe?.somersloopValue ?? 0,
		overclock: activeItemRecipe?.overclockValue ?? 100,
		machineCount: activeItemRecipe?.machineCount ?? 1,
		basePower: activeItemRecipe?.basePower ?? 0,
	}), [
		activeItemRecipe?.somersloopValue,
		activeItemRecipe?.overclockValue,
		activeItemRecipe?.machineCount,
		currentConsumption,
		activeItemRecipe?.basePower,
	]);
	const recipePower = useMemo(() => calculateMachinePower({
		somersloop,
		overclock,
		machineCount,
		basePower,
	}), [somersloop, overclock, machineCount, basePower]);
	const remainingPower = useMemo(() => totalPower - currentConsumptionAdjusted - recipePower, [totalPower, currentConsumptionAdjusted, recipePower]);

	if (!record) {
		return;
	}
	let machineNode;
	let nodeTypeNode;
	let showLeftArrow = true;
	if (record.isRaw) {
		machineNode = (
			<ComboBox
				isRequired={true}
				options={Miners}
				label="Miner"
				valueField="id"
				displayField="name"
				value={machineId}
				setValue={setMachineId}
			/>
		);
		nodeTypeNode = (
			<ComboBox
				isRequired={true}
				label="Node Type"
				options={NodeTypes}
				valueField="id"
				displayField="name"
				inputCls="w-21"
				labelCls="w-21"
				value={nodeType}
				setValue={setNodeType}
				setSelection={setSelectedNodeType}
			/>
		);
	}
	else if (record.isLiquid) {
		showLeftArrow = false;
		if (record.id !== "recipeWater") {
			nodeTypeNode = (
				<ComboBox
					isRequired={true}
					label="Node Type"
					options={NodeTypes}
					valueField="id"
					displayField="name"
					inputCls="w-21"
					labelCls="w-21"
					value={nodeType}
					setValue={setNodeType}
					setSelection={setSelectedNodeType}
				/>
			);
		}
	}
	else {
		machineNode = (
			<RecipeItems
				items={record.items}
				recipeId={recipeId}
				recipeType="consumes"
				highlightItem={itemId}
				multiplier={overclockValue * machineCount}
			/>
		);
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
						defaultValue={100}
						minValue={0}
						maxValue={250}
						labelCls="w-26"
						inputWidth="w-16"
						onChange={setOverclock}
						value={overclock}
					/>
					<FieldNumber
						label="Somersloop"
						defaultValue={0}
						step={0.01}
						minValue={0}
						maxValue={1}
						isRequired={true}
						labelCls="w-26"
						inputWidth="w-16"
						value={somersloop}
						onChange={setSomersloop}
					/>
				</section>
				<section className="flex flex-col space-y-2">
					<FieldNumber
						label="Machines"
						defaultValue={1}
						minValue={1}
						labelCls="w-21"
						inputWidth="w-21"
						onChange={setMachineCount}
						value={machineCount}
					/>
					{nodeTypeNode}
				</section>
				<section className="flex flex-col space-y-2 ml-auto">
					<table className="border-collapse">
						<tbody>
							<tr>
								<td className="py-1 px-2 text-right">Total Power</td>
								<td className="py-1 px-2 text-right">
									{formatNumber(totalPower, "MW")}
								</td>
							</tr>
							<tr>
								<td className="py-1 px-2 text-right">Current Consumption</td>
								<td className="py-1 px-2 text-right">
									-
									{" "}
									{formatNumber(currentConsumptionAdjusted, "MW")}
								</td>
							</tr>
							<tr>
								<td className="py-1 px-2 text-right border-b">Recipe Consumption</td>
								<td className="py-1 px-2 text-right border-b">
									-
									{" "}
									{formatNumber(recipePower, "MW")}
								</td>
							</tr>
							<tr>
								<td className="py-1 px-2 text-right">Remaining Power</td>
								<td className="py-1 px-2 text-right">
									{formatNumber(remainingPower, "MW")}
								</td>
							</tr>
						</tbody>
					</table>
				</section>
			</section>
			<section className="flex items-center justify-center space-x-4 flex-1">
				{machineNode}
				<RecipeMachine
					showLeftArrow={showLeftArrow}
					machineId={machineId as string}
				/>
				<RecipeItems
					items={record.items}
					recipeId={recipeId}
					recipeType="produces"
					highlightItem={itemId}
					multiplier={overclockValue * machineCount * calculateSomersloop(somersloop, "produces") * nodeTypeMultiplier}
				/>
			</section>
		</section>
	);
}

export function ViewRecipe({ recipeId, recipeType, itemId, show }: IViewRecipe) {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [availableRecipes, setAvailableRecipes] = useState<IRecipe[]>(recipes);
	const [recipe, setRecipe] = useState<string | undefined>(itemId ?? "");
	const [recipeRecord, setRecipeRecord] = useState<IRecipe>();
	const activeItemRecipe = useAppSelector((state) => getActiveItemRecipe(state, recipeId));
	const [overclock, setOverclock] = useState(activeItemRecipe?.overclockValue ?? 100);
	const [somersloop, setSomersloop] = useState(activeItemRecipe?.somersloopValue ?? 0);
	const [machineCount, setMachineCount] = useState(activeItemRecipe?.machineCount ?? 1);
	const [machineId, setMachineId] = useState<TMachine>();
	const [nodeType, setNodeType] = useState<TNodeType | undefined>();
	const [selectedNodeType, setSelectedNodeType] = useState<INodeType>();
	const basePower = useMemo(() => {
		let basePower = recipeRecord?.basePower ?? 0;
		if (recipeRecord?.isRaw && machineId) {
			const found = machines.find(({ id }) => id === machineId)?.basePower;
			if (found) {
				basePower = found;
			}
		}
		return basePower;
	}, [machineId, recipeRecord?.basePower, recipeRecord?.isRaw]);
	const footerNode = (
		<ViewRecipeSave
			record={recipeRecord}
			onClick={onClickSave}
		/>
	);
	const nodeTypeMultiplier = useMemo(() => {
		if ((recipeRecord?.isRaw || recipeRecord?.isLiquid) && selectedNodeType) {
			let multiplier = 1;
			if (machineId === "minerMk2") {
				multiplier = 2;
			}
			else if (machineId === "minerMk3") {
				multiplier = 4;
			}
			return (selectedNodeType.amountPerMinute / 120) * multiplier;
		}
		// Not using a miner or extractor, so return 1 as identity value
		return 1;
	}, [recipeRecord, selectedNodeType, machineId]);

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
				basePower,
				nodeType,
				machineCount,
				recipeRecord,
				activeItemRecipe,
				overclock,
				somersloop,
				nodeTypeMultiplier,
				machineId: machineId ?? recipeRecord.producedIn,
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
			setMachineId(activeItemRecipe.producedIn);
			setNodeType(activeItemRecipe.nodeType);
		}
	}, [activeItemRecipe, setRecipe]);

	useEffect(() => {
		if (recipeRecord && !activeItemRecipe?.isRaw) {
			setMachineId(recipeRecord.producedIn);
		}
	}, [recipeRecord, activeItemRecipe]);

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
					machineId={machineId}
					setMachineId={setMachineId}
					nodeType={nodeType}
					setNodeType={setNodeType}
					setSelectedNodeType={setSelectedNodeType}
					nodeTypeMultiplier={nodeTypeMultiplier}
					basePower={basePower}
				/>
			</article>
		</BaseDialog>
	);
}
