import justCapitalize from "just-capitalize";
import { IInventoryRecipe, IRecipeItem, TItemKey } from "@/types.ts";

const CapitalizeWordBoundary = /(?=[A-Z])/;

export { default as clone } from "just-clone";

export { v4 as uuid } from "uuid";

export { default as getData } from "just-safe-get";

export { default as pluralize } from "pluralize";

export function emptyFn() {

}

export function sumRecipes(value: IInventoryRecipe[], id: TItemKey) {
	let produces = 0;
	let consumes = 0;
	value.forEach(({ items }) => {
		const found = items.filter(({ itemId }) => itemId === id);
		found.forEach(({ recipeType, amountPerMinuteDisplay }) => {
			if (recipeType === "produces") {
				produces += amountPerMinuteDisplay;
			}
			else if (recipeType === "consumes") {
				consumes += amountPerMinuteDisplay;
			}
		});
	});
	return {
		produces,
		consumes,
	};
}

export function calculateAmountDisplays(recipes: IRecipeItem[], overclock: number, machineCount: number) {
	overclock /= 100;
	recipes.forEach((item) => {
		item.amountPerMinuteDisplay = item.amountPerMinute * overclock * machineCount;
		item.amountPerCycleDisplay = item.amountPerCycle * overclock * machineCount;
	});
}

export function capitalizeFirstLetters(value: string) {
	const splits = value.split(CapitalizeWordBoundary);
	return splits.map((word) => justCapitalize(word)).join(" ");
}
