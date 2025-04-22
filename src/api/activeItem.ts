import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TNodeType } from "@/api/data.ts";
import { getInventoryItem, updateRecipesThunk } from "@/api/inventory.ts";
import { TMachine } from "@/api/machines.ts";
import { AppThunk } from "@/store.ts";
import { IInventoryItem, IInventoryRecipe, IRecipe } from "@/types.ts";
import { calculateAmountDisplays, clone, sumRecipes, uuid } from "@/utils/common.ts";

export interface IActiveItemState {
	activeItem?: IInventoryItem;
	activeItemRecipe?: IInventoryRecipe;
}

const initialState: IActiveItemState = {};

export const activeItemSlice = createSlice({
	initialState,
	name: "activeItem",
	reducers: {
		setActiveItem(state, { payload }: PayloadAction<IInventoryItem | undefined>) {
			state.activeItem = payload;
		},
		updateItemRecipe({ activeItem }, { payload }: PayloadAction<IInventoryRecipe>) {
			if (!activeItem) {
				return;
			}
			const { id, overclockValue, machineCount, somersloopValue, items, nodeTypeMultiplier } = payload;
			const { recipes } = activeItem;
			const foundIndex = recipes.findIndex((item) => item.id === id) ?? -1;
			calculateAmountDisplays({
				items,
				machineCount,
				nodeTypeMultiplier,
				overclock: overclockValue,
				somersloop: somersloopValue,
			});
			if (foundIndex >= 0) {
				recipes[foundIndex] = payload;
			}
			else {
				recipes.push(payload);
			}
			const { produces, consumes } = sumRecipes(recipes, activeItem.id);
			activeItem.producingTotal = produces;
			activeItem.consumingTotal = consumes;
		},
		deleteItemRecipe({ activeItem }, { payload }: PayloadAction<IInventoryRecipe>) {
			if (!activeItem) {
				return;
			}
			const { id } = payload;
			const { recipes } = activeItem;
			const foundIndex = recipes.findIndex((item) => item.id === id) ?? -1;
			if (foundIndex >= 0) {
				recipes.splice(foundIndex, 1);
			}
			const { produces, consumes } = sumRecipes(recipes, activeItem.id);
			activeItem.producingTotal = produces;
			activeItem.consumingTotal = consumes;
		},
	},
	selectors: {
		getActiveItem(state) {
			return state.activeItem;
		},
		getActiveItemRecipes(state) {
			return state.activeItem?.recipes;
		},
		getActiveItemRecipe(state, recipeId): IInventoryRecipe | undefined {
			return activeItemSlice.getSelectors().getActiveItemRecipes(state)?.find(({ id }) => id === recipeId);
		},
	},
});

export const { setActiveItem, updateItemRecipe, deleteItemRecipe } = activeItemSlice.actions;

export const { getActiveItem, getActiveItemRecipes, getActiveItemRecipe } = activeItemSlice.selectors;

export function loadItemThunk(itemId: string): AppThunk {
	return function thunk(dispatch, getState) {
		const item = getInventoryItem(getState(), itemId);
		dispatch(setActiveItem(item));
	};
}

interface ISaveItemThunk {
	recipeRecord: IRecipe;
	activeItemRecipe?: IInventoryRecipe;
	machineCount: number;
	somersloop: number;
	overclock: number;
	nodeTypeMultiplier: number;
	machineId: TMachine;
	nodeType?: TNodeType;
}

export function saveItemThunk({ recipeRecord, nodeType, machineId, activeItemRecipe, machineCount, overclock, somersloop, nodeTypeMultiplier }: ISaveItemThunk): AppThunk {
	return function thunk(dispatch, getState) {
		dispatch(updateItemRecipe({
			nodeTypeMultiplier,
			machineCount,
			nodeType,
			recipeId: recipeRecord.id,
			recipeName: recipeRecord.name,
			cyclesPerMinute: recipeRecord.cyclesPerMinute,
			isAlternate: recipeRecord.isAlternate,
			items: clone(recipeRecord.items),
			isRaw: recipeRecord.isRaw,
			producedIn: machineId,
			productionCycleTime: recipeRecord.productionCycleTime,
			id: activeItemRecipe?.id || uuid(),
			overclockValue: overclock,
			somersloopValue: somersloop,
		}));
		dispatch(updateRecipesThunk(getActiveItem(getState())!));
	};
}
