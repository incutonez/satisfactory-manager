import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getActiveFactory, IFactory, loadFactoryInventoryThunk } from "@/api/factories.ts";
import defaultInventory from "@/api/inventory.json";
import { getGenerators, importGeneratorsThunk, loadPowerThunk, savePowerGeneratorsThunk } from "@/api/power.ts";
import { AppThunk } from "@/store.ts";
import { IInventoryItem, IInventoryRecipe, IProductionImport } from "@/types.ts";
import { clone, downloadFile, sumRecipes } from "@/utils/common.ts";

export const inventoryItems = defaultInventory as IInventoryItem[];

export interface IState {
	inventory: IInventoryItem[];
	inventoryId: string;
	/**
	 * We have a draft of the inventory because we need to be able to calculate recipe values when we update an
	 * active item's recipe... so we can show the tooltip that has a table of the current calculations.  inventoryDraft
	 * then either gets reset to inventory upon cancel in ViewInventoryItem or if saved, inventory becomes inventoryDraft
	 */
	inventoryDraft: IInventoryItem[];
}

const initialState: IState = {
	inventory: [],
	inventoryId: "",
	inventoryDraft: [],
};

export const inventorySlice = createSlice({
	initialState,
	name: "inventory",
	reducers: {
		deleteRecipe(state, { payload }: PayloadAction<IInventoryRecipe>) {
			payload.items.forEach(({ itemId }) => {
				const found = state.inventoryDraft.find((record) => record.id === itemId);
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
				const found = state.inventoryDraft.find((record) => record.id === itemId);
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
				const found = state.inventoryDraft.find((record) => record.id === itemId);
				processedIds.push(itemId);
				if (found) {
					found.recipes.push(payload);
				}
			}
		},
		loadInventory(state, { payload }: PayloadAction<IFactory>) {
			const inventoryId = `factory_${payload.id}_inventory`;
			const data = localStorage.getItem(inventoryId);
			const inventory: IInventoryItem[] = data ? JSON.parse(data) : clone(inventoryItems);
			state.inventory = inventory;
			state.inventoryDraft = inventory;
			state.inventoryId = inventoryId;
		},
		saveInventory(state, { payload }: PayloadAction<boolean>) {
			// Clear
			if (payload) {
				localStorage.removeItem(state.inventoryId);
			}
			else {
				localStorage.setItem(state.inventoryId, JSON.stringify(state.inventoryDraft));
			}
		},
		updateDraftInventory(state) {
			state.inventoryDraft.forEach((item) => {
				const { produces, consumes } = sumRecipes(item.recipes, item.id);
				item.producingTotal = produces;
				item.consumingTotal = consumes;
				item.total = item.producingTotal - item.consumingTotal;
			});
		},
		resetDraftInventory(state) {
			state.inventoryDraft = state.inventory;
		},
		deleteInventory(state) {
			localStorage.removeItem(state.inventoryId);
		},
		importInventory(state, { payload }: PayloadAction<IInventoryItem[]>) {
			state.inventory = payload;
			state.inventoryDraft = state.inventory;
		},
	},
	selectors: {
		getInventory(state) {
			return state.inventory;
		},
		getInventoryId(state) {
			return state.inventoryId;
		},
		getInventoryDraft(state) {
			return state.inventoryDraft;
		},
		getInventoryItem(state, itemId: string) {
			return findInventoryItemById(state.inventoryDraft, itemId);
		},
	},
});

export const { resetDraftInventory, updateDraftInventory, importInventory, deleteInventory, addRecipe, updateRecipe, deleteRecipe, loadInventory, saveInventory } = inventorySlice.actions;

export const { getInventoryId, getInventoryDraft, getInventory, getInventoryItem } = inventorySlice.selectors;

export function findInventoryItemById(inventory: IInventoryItem[], itemId: string) {
	return inventory.find(({ id }) => id === itemId);
}

export function downloadInventory(): AppThunk {
	return function thunk(_dispatch, getState) {
		const inventory = getInventory(getState());
		const generators = getGenerators(getState());
		const factoryName = getActiveFactory(getState())?.name;
		downloadFile(new Blob([JSON.stringify({
			inventory,
			generators,
		})], {
			type: "application/json",
		}), factoryName);
	};
}

export function resetInventoryDraftThunk(): AppThunk {
	return function thunk(dispatch) {
		dispatch(resetDraftInventory());
		dispatch(loadPowerThunk());
	};
}

export function clearInventoryThunk(): AppThunk {
	return function thunk(dispatch) {
		dispatch(saveInventory(true));
		dispatch(savePowerGeneratorsThunk(true));
		dispatch(loadFactoryInventoryThunk());
	};
}

export function importInventoryThunk({ inventory, generators }: IProductionImport): AppThunk {
	return function thunk(dispatch) {
		dispatch(importInventory(inventory));
		dispatch(saveInventory(false));
		dispatch(importGeneratorsThunk(generators));
	};
}

export function updateRecipesThunk(updateRecord: IInventoryItem): AppThunk {
	return function thunk(dispatch, getState) {
		// This gets the previous state of our record
		const found = findInventoryItemById(getInventoryDraft(getState()), updateRecord.id)!;
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
		dispatch(updateDraftInventory());
		dispatch(loadPowerThunk());
	};
}

export function saveInventoryThunk(): AppThunk {
	return function thunk(dispatch) {
		dispatch(saveInventory(false));
		dispatch(loadFactoryInventoryThunk());
	};
}
