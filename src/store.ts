import { useDispatch, useSelector } from "react-redux";
import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { factoriesSlice } from "@/api/factories.ts";
import { inventorySlice } from "@/api/inventory.ts";

const reducer = combineSlices(inventorySlice, factoriesSlice);

export const store = configureStore({
	reducer,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch

export const useAppSelector = useSelector.withTypes<RootState>();

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
