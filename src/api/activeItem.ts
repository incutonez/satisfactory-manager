import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IInventoryItem, IInventoryRecipe, TRecipeType } from "@/types.ts";
import { calculateAmountDisplays, sumRecipes } from "@/utils/common.ts";

export interface IActiveItemState {
	activeItem?: IInventoryItem;
}

export interface IActiveItemPayload {
	record: IInventoryRecipe;
	recipeType?: TRecipeType;
}

const initialState: IActiveItemState = {};

export const activeItemSlice = createSlice({
	initialState,
	name: "activeItem",
	reducers: {
		setActiveItem(state, { payload }: PayloadAction<IInventoryItem | undefined>) {
			state.activeItem = payload;
		},
		updateItemRecipe({ activeItem }, { payload }: PayloadAction<IActiveItemPayload>) {
			if (!activeItem) {
				return;
			}
			const { record } = payload;
			const { id, overclockValue, machineCount, items } = record;
			const { recipes } = activeItem;
			const foundIndex = recipes.findIndex((item) => item.id === id) ?? -1;
			calculateAmountDisplays(items, overclockValue, machineCount);
			if (foundIndex >= 0) {
				recipes[foundIndex] = record;
			}
			else {
				recipes.push(record);
			}
			const { produces, consumes } = sumRecipes(recipes, activeItem.id);
			activeItem.producingTotal = produces;
			activeItem.consumingTotal = consumes;
		},
		deleteItemRecipe({ activeItem }, { payload }: PayloadAction<IActiveItemPayload>) {
			if (!activeItem) {
				return;
			}
			const { id } = payload.record;
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
			return state.activeItem?.recipes ?? [];
		},
	},
});

export const { setActiveItem, updateItemRecipe, deleteItemRecipe } = activeItemSlice.actions;

export const { getActiveItem, getActiveItemRecipes } = activeItemSlice.selectors;
