import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { round } from "mathjs";
import { getInventoryDraft, getInventoryId } from "@/api/inventory.ts";
import { machines } from "@/api/machines.ts";
import { AppThunk } from "@/store.ts";
import { IMachinePower, ISetPower } from "@/types.ts";
import { calculateMachinePower } from "@/utils/common.ts";

export interface IPowerState {
	// This is derived from inventoryDraft + saved generators in localStorage
	data: IMachinePower[];
	totalPower: number;
	totalPowerConsumption: number;
	activeItem?: IMachinePower;
}

const initialState: IPowerState = {
	data: [],
	totalPower: 0,
	totalPowerConsumption: 0,
};

export const powerSlice = createSlice({
	name: "power",
	initialState,
	reducers: {
		setPowerData(state, { payload }: PayloadAction<ISetPower>) {
			state.data = payload.data;
			state.totalPower = payload.totalPower;
			state.totalPowerConsumption = payload.totalPowerConsumption;
		},
		setActivePowerItem(state, { payload }: PayloadAction<IMachinePower>) {
			state.activeItem = payload;
		},
		deletePowerItem(state, { payload }: PayloadAction<IMachinePower>) {
			const { id } = payload;
			const foundIndex = state.data.findIndex((item) => item.id === id);
			if (foundIndex !== -1) {
				state.data.splice(foundIndex, 1);
			}
		},
		updatePowerItem(state, { payload }: PayloadAction<IMachinePower>) {
			const foundIndex = state.data.findIndex(({ id }) => id === payload.id);
			if (foundIndex === -1) {
				state.data.push(payload);
			}
			else {
				state.data[foundIndex] = payload;
			}
		},
		importGenerators(state, { payload }: PayloadAction<IMachinePower[]>) {
			state.data.push(...payload);
		},
	},
	selectors: {
		getPowerData(state) {
			return state.data;
		},
		getTotalPower(state) {
			return state.totalPower;
		},
		getTotalPowerConsumption(state) {
			return state.totalPowerConsumption;
		},
		getActivePowerItem(state) {
			return state.activeItem;
		},
	},
});

export const { importGenerators, deletePowerItem, updatePowerItem, setPowerData, setActivePowerItem } = powerSlice.actions;

export const { getPowerData, getTotalPower, getTotalPowerConsumption, getActivePowerItem } = powerSlice.selectors;

export const getGenerators = createSelector(getPowerData, (state) => state.filter(({ powerType }) => powerType === "produces"));

export function loadPowerThunk(): AppThunk {
	return function thunk(dispatch, getState) {
		const key = getInventoryId(getState()) + "_generators";
		const generatorsStorage = localStorage.getItem(key);
		const data: IMachinePower[] = generatorsStorage ? JSON.parse(generatorsStorage) : [];
		const inventory = getInventoryDraft(getState());
		let totalConsumption = 0;
		const totalPower = data.reduce((total, { basePower }) => total + basePower, 0);
		inventory.forEach(({ recipes }) => {
			for (const recipe of recipes) {
				const found = data.find((record) => record.id === recipe.id);
				if (found) {
					continue;
				}
				const machineId = recipe.producedIn;
				const foundMachine = machines.find(({ id }) => id === machineId);
				const basePower = calculateMachinePower({
					basePower: recipe.basePower,
					somersloop: recipe.somersloopValue,
					overclock: recipe.overclockValue,
					machineCount: recipe.machineCount,
				});
				totalConsumption += basePower;
				data.push({
					basePower,
					machineId,
					id: recipe.id,
					name: foundMachine?.name ?? "",
					recipeId: recipe.recipeId,
					recipeName: recipe.recipeName,
					count: recipe.machineCount,
					powerType: "consumes",
					overclock: recipe.overclockValue,
					somersloop: recipe.somersloopValue,
					image: foundMachine?.image ?? "",
				});
			}
		});
		dispatch(setPowerData({
			data,
			totalPower,
			totalPowerConsumption: round(totalConsumption, 2),
		}));
	};
}

export function importGeneratorsThunk(generators: IMachinePower[]): AppThunk {
	return function thunk(dispatch) {
		dispatch(importGenerators(generators));
		dispatch(savePowerGeneratorsThunk());
		dispatch(loadPowerThunk());
	};
}

export function loadPowerGenerator(id: string): AppThunk {
	return function thunk(dispatch, getState) {
		const data = getPowerData(getState());
		const found = data.find((record) => record.id === id);
		if (found) {
			dispatch(setActivePowerItem(found));
		}
	};
}

export function deletePowerGenerator(generator: IMachinePower): AppThunk {
	return function thunk(dispatch) {
		dispatch(deletePowerItem(generator));
		dispatch(savePowerGeneratorsThunk());
		dispatch(loadPowerThunk());
	};
}

export function savePowerGeneratorThunk(generator: IMachinePower): AppThunk {
	return function thunk(dispatch) {
		dispatch(updatePowerItem(generator));
		dispatch(savePowerGeneratorsThunk());
		dispatch(loadPowerThunk());
	};
}

export function savePowerGeneratorsThunk(clear = false): AppThunk {
	return function thunk(_dispatch, getState) {
		const key = getInventoryId(getState()) + "_generators";
		if (clear) {
			localStorage.removeItem(key);
		}
		else {
			const data = getGenerators(getState());
			localStorage.setItem(key, JSON.stringify(data));
		}
	};
}
