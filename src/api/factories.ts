import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { deleteInventory, loadInventory } from "@/api/inventory.ts";
import { loadPowerThunk } from "@/api/power.ts";
import { AppThunk } from "@/store.ts";
import { uuid } from "@/utils/common.ts";

export interface IFactory {
	id: string;
	name: string;
}

export interface IFactoryState {
	factories: IFactory[];
	activeFactory?: IFactory;
}

const initialState: IFactoryState = {
	factories: [],
};

export const factoriesSlice = createSlice({
	initialState,
	name: "factories",
	reducers: {
		loadFactories(state) {
			let factories: IFactory[] = [];
			const factoriesData = localStorage.getItem("factories");
			if (factoriesData) {
				factories = JSON.parse(factoriesData) as IFactory[];
			}
			else {
				factories.push({
					id: uuid(),
					name: "Default Factory",
				});
				// Very first time, so we're setting the initial data
				localStorage.setItem("factories", JSON.stringify(factories));
			}
			state.factories = factories;
		},
		setActiveFactory(state, { payload }: PayloadAction<IFactory | undefined | string>) {
			if (typeof payload === "string") {
				payload = findFactoryById(state.factories, payload);
			}
			if (!payload) {
				const activeFactoryId = localStorage.getItem("activeFactoryId");
				if (activeFactoryId) {
					payload = findFactoryById(state.factories, activeFactoryId);
				}
				else {
					payload = state.factories[0];
				}
			}
			state.activeFactory = payload as IFactory;
			if (payload) {
				localStorage.setItem("activeFactoryId", payload.id);
			}
		},
		updateFactoryName(state, { payload }: PayloadAction<string>) {
			const { activeFactory } = state;
			if (!activeFactory) {
				return;
			}
			const found = findFactoryById(state.factories, activeFactory.id);
			if (found) {
				// Make sure we update the factory item AND the activeFactory state value
				found.name = activeFactory.name = payload;
				localStorage.setItem("factories", JSON.stringify(state.factories));
			}
		},
		addFactory(state, { payload }: PayloadAction<IFactory>) {
			state.factories.push(payload);
			localStorage.setItem("factories", JSON.stringify(state.factories));
		},
		deleteFactory(state, { payload }: PayloadAction<IFactory>) {
			const factoryId = payload.id;
			const foundIndex = state.factories.findIndex(({ id }) => id === factoryId);
			state.factories.splice(foundIndex, 1);
			localStorage.removeItem("activeFactoryId");
			localStorage.setItem("factories", JSON.stringify(state.factories));
		},
	},
	selectors: {
		getFactories(state) {
			return state.factories;
		},
		getActiveFactory(state) {
			return state.activeFactory;
		},
	},
});

export const { deleteFactory, setActiveFactory, updateFactoryName, loadFactories, addFactory } = factoriesSlice.actions;

export const { getFactories, getActiveFactory } = factoriesSlice.selectors;

export function findFactoryById(factories: IFactory[], factoryId: string) {
	return factories.find(({ id }) => id === factoryId);
}

export function loadFactoriesThunk(): AppThunk {
	return function thunk(dispatch) {
		dispatch(loadFactories());
		dispatch(setActiveFactory());
	};
}

export function loadFactoryInventoryThunk(factory?: IFactory): AppThunk {
	return function thunk(dispatch, getState) {
		factory ??= getActiveFactory(getState());
		if (factory) {
			dispatch(loadInventory(factory));
			dispatch(loadPowerThunk());
		}
	};
}

export function deleteFactoryThunk(factory: IFactory): AppThunk {
	return function thunk(dispatch) {
		dispatch(deleteFactory(factory));
		dispatch(deleteInventory());
		dispatch(setActiveFactory());
	};
}

export function updateFactoryThunk(factoryName: string, isEdit = true): AppThunk {
	return function thunk(dispatch) {
		if (isEdit) {
			dispatch(updateFactoryName(factoryName));
		}
		else {
			const id = uuid();
			dispatch(addFactory({
				id,
				name: factoryName,
			}));
			dispatch(setActiveFactory(id));
		}
	};
}
