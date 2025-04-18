import { createSelector, createSlice, PayloadAction, ThunkAction, UnknownAction } from "@reduxjs/toolkit";
import { deleteInventory } from "@/api/inventory.ts";
import { RootState } from "@/store.ts";
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
			let factories: IFactory[] = [{
				id: uuid(),
				name: "Default Factory",
			}];
			const factoriesData = localStorage.getItem("factories");
			if (factoriesData) {
				factories = JSON.parse(factoriesData) as IFactory[];
			}
			else {
				// Very first time, so we're setting the initial data
				localStorage.setItem("factories", JSON.stringify(factories));
			}
			state.factories = factories;
			factoriesSlice.caseReducers.setActiveFactory(state, {
				type: "setActiveFactory",
				payload: undefined,
			});
		},
		setActiveFactory(state, { payload }: PayloadAction<IFactory | undefined | string>) {
			if (typeof payload === "string") {
				payload = state.factories.find(({ id }) => id === payload);
			}
			if (!payload) {
				const activeFactoryId = localStorage.getItem("activeFactoryId");
				if (activeFactoryId) {
					payload = state.factories.find(({ id }) => id === activeFactoryId);
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
		setActiveFactoryName(state, { payload }: PayloadAction<IFactory>) {
			const found = state.factories.find((factory) => factory.id === payload.id);
			if (found) {
				found.name = payload.name;
			}
			localStorage.setItem("factories", JSON.stringify(state.factories));
			localStorage.setItem("activeFactoryId", JSON.stringify(payload.id));
		},
		addFactory(state, { payload }: PayloadAction<IFactory>) {
			state.factories.push(payload);
			localStorage.setItem("factories", JSON.stringify(state.factories));
		},
		deleteFactory(state, { payload }: PayloadAction<IFactory>) {
			state.factories.splice(state.factories.indexOf(payload), 1);
			localStorage.removeItem("activeFactoryId");
			localStorage.setItem("factories", JSON.stringify(state.factories));
		},
	},
	// TODOJEF: Move selectors to here?
	// https://redux-toolkit.js.org/api/createSlice#selectors-1
});

export const { deleteFactory, setActiveFactory, setActiveFactoryName, loadFactories, addFactory } = factoriesSlice.actions;

export function selectFactories(state: RootState) {
	return state.factories;
}

export const getFactories = createSelector(selectFactories, (state) => state.factories);

export const getActiveFactory = createSelector(selectFactories, (state) => state.activeFactory);

export function deleteFactoryThunk(factory: IFactory): ThunkAction<void, RootState, unknown, UnknownAction> {
	return function thunk(dispatch) {
		dispatch(deleteFactory(factory));
		dispatch(deleteInventory());
		dispatch(setActiveFactory());
	};
}

export function addFactoryThunk(factory: IFactory): ThunkAction<void, RootState, unknown, UnknownAction> {
	return function thunk(dispatch) {
		dispatch(addFactory(factory));
		dispatch(setActiveFactory(factory));
	};
}
