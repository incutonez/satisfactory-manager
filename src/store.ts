import { useDispatch, useSelector } from "react-redux";
import { Action, combineSlices, configureStore, ThunkAction, UnknownAction } from "@reduxjs/toolkit";
import { activeItemSlice } from "@/api/activeItem.ts";
import { factoriesSlice } from "@/api/factories.ts";
import { inventorySlice } from "@/api/inventory.ts";
import { powerSlice } from "@/api/power.ts";

const reducer = combineSlices(inventorySlice, factoriesSlice, activeItemSlice, powerSlice);

export type AppThunk<TAction extends Action = UnknownAction> = ThunkAction<void, RootState, unknown, TAction>;

export const store = configureStore({
	reducer,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch

export const useAppSelector = useSelector.withTypes<RootState>();

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
