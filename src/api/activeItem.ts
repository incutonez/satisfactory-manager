import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getInventoryItem } from "@/api/inventory.ts";
import { AppThunk } from "@/store.ts";
import { IInventoryItem, IInventoryRecipe } from "@/types.ts";
import { calculateAmountDisplays, sumRecipes } from "@/utils/common.ts";

export interface IActiveItemState {
	activeItem?: IInventoryItem;
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
			const { id, overclockValue, machineCount, items } = payload;
			const { recipes } = activeItem;
			const foundIndex = recipes.findIndex((item) => item.id === id) ?? -1;
			calculateAmountDisplays(items, overclockValue, machineCount);
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
