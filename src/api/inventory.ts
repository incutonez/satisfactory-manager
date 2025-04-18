import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IFactory } from "@/api/factories.ts";
import defaultInventory from "@/api/inventory.json";
import { RootState, store } from "@/store.ts";
import { IInventoryItem, IInventoryRecipe, TRecipeType } from "@/types.ts";
import { calculateAmountDisplays, clone, sumRecipes } from "@/utils/common.ts";

export const inventoryItems = defaultInventory as IInventoryItem[];

export interface IState {
	inventory: IInventoryItem[];
	inventoryId: string;
	activeItem?: IInventoryItem;
}

export interface IActiveItemPayload {
	record: IInventoryRecipe;
	recipeType?: TRecipeType;
}

const initialState: IState = {
	inventory: [],
	inventoryId: "",
};

export const inventorySlice = createSlice({
	initialState,
	name: "inventory",
	reducers: {
		setActiveItem(state, { payload }: PayloadAction<IInventoryItem>) {
			state.activeItem = payload;
		},
		deleteRecipe(state, { payload }: PayloadAction<IInventoryRecipe>) {
			payload.items.forEach(({ itemId }) => {
				const found = state.inventory.find((record) => record.id === itemId);
				if (found) {
					const foundIndex = found.recipes.findIndex((record) => record.id === payload.id);
					if (foundIndex >= 0) {
						found.recipes.splice(foundIndex, 1);
					}
				}
			});
		},
		updateRecipe(state, { payload }: PayloadAction<IInventoryRecipe>) {
			payload.items.forEach(({ itemId }) => {
				const found = state.inventory.find((record) => record.id === itemId);
				if (found) {
					const { recipes } = found;
					const foundIndex = recipes.findIndex((record) => record.id === payload.id);
					if (foundIndex >= 0) {
						recipes[foundIndex] = payload;
					}
				}
			});
		},
		addRecipe(state, { payload }: PayloadAction<IInventoryRecipe>) {
			const processedIds: string[] = [];
			for (const { itemId } of payload.items) {
				// Some recipes produce and consume this item, so we only want 1 record representing that
				if (processedIds.find((id) => id === itemId)) {
					continue;
				}
				const found = state.inventory.find((record) => record.id === itemId);
				processedIds.push(itemId);
				if (found) {
					found.recipes.push(payload);
				}
			}
		},
		updateActiveItemRecipe({ activeItem }, { payload }: PayloadAction<IActiveItemPayload>) {
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
		deleteActiveItemRecipe({ activeItem }, { payload }: PayloadAction<IActiveItemPayload>) {
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
		loadInventory(state, { payload }: PayloadAction<IFactory>) {
			const inventoryId = `inventory_${payload.id}`;
			const data = localStorage.getItem(inventoryId);
			const inventory: IInventoryItem[] = data ? JSON.parse(data) : clone(inventoryItems);
			inventory.forEach((item) => {
				const { produces, consumes } = sumRecipes(item.recipes, item.id);
				item.producingTotal = produces;
				item.consumingTotal = consumes;
				item.total = item.producingTotal - item.consumingTotal;
			});
			state.inventory = inventory;
			state.inventoryId = inventoryId;
		},
		saveInventory(state, { payload }: PayloadAction<boolean>) {
			// Clear
			if (payload) {
				localStorage.removeItem(state.inventoryId);
			}
			else {
				localStorage.setItem(state.inventoryId, JSON.stringify(state.inventory));
			}
		},
		deleteInventory(state) {
			localStorage.removeItem(state.inventoryId);
		},
	},
});

export const { deleteInventory, addRecipe, updateRecipe, deleteRecipe, loadInventory, saveInventory, setActiveItem, updateActiveItemRecipe, deleteActiveItemRecipe } = inventorySlice.actions;

export function selectInventory(state: RootState) {
	return state.inventory;
}

export const getInventory = createSelector(selectInventory, (state) => state.inventory);

export const getActiveItem = createSelector(selectInventory, (state) => state.activeItem);

export const getActiveItemRecipes = createSelector([getActiveItem], (state) => state?.recipes ?? []);

export const getInventoryItem = (itemId: string) => createSelector([getInventory], (state) => state.find((item) => item.id === itemId));

export function getStateInventoryItem(itemId: string) {
	return store.getState().inventory.inventory.find((item) => item.id === itemId);
}
