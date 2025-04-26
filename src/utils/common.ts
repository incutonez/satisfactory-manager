import { Ref } from "react";
import justCapitalize from "just-capitalize";
import { pow, round } from "mathjs";
import MimeTypes from "mime-types";
import {
	ICalculateAmountDisplays,
	ICalculateMachinePower,
	IInventoryRecipe,
	TItemKey,
	TRecipeType,
} from "@/types.ts";

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

export function calculateSomersloop(somersloop: number, recipeType: TRecipeType) {
	return recipeType === "produces" ? 1 + somersloop : 1;
}

export function calculateAmountDisplays({ items, overclock, somersloop, machineCount, nodeTypeMultiplier = 1 }: ICalculateAmountDisplays) {
	overclock /= 100;
	items.forEach((item) => {
		const multiplier = overclock * machineCount * calculateSomersloop(somersloop, item.recipeType) * nodeTypeMultiplier;
		item.amountPerMinuteDisplay = item.amountPerMinute * multiplier;
		item.amountPerCycleDisplay = item.amountPerCycle * multiplier;
	});
}

export function capitalizeFirstLetters(value: string) {
	const splits = value.split(CapitalizeWordBoundary);
	return splits.map((word) => justCapitalize(word)).join(" ");
}

export function downloadFile(blob: Blob, name = "download", extension = MimeTypes.extension(blob.type)) {
	if (!extension) {
		return;
	}
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.style.display = "none";
	a.href = url;
	// the filename you want
	a.download = `${name}.${extension}`;
	document.body.appendChild(a);
	a.click();
	URL.revokeObjectURL(url);
}

export function calculateMachinePower({ overclock, machineCount, somersloop, basePower }: ICalculateMachinePower) {
	overclock = round(pow(overclock / 100, 1.321928) as number, 2);
	somersloop = pow(1 + somersloop, 2) as number;
	return basePower * somersloop * overclock * machineCount;
}

export function setRef<T>(ref: Ref<T> | undefined, el: T) {
	if (ref) {
		if (typeof ref === "function") {
			ref(el);
		}
		else {
			ref.current = el;
		}
	}
}

export function formatNumber(value: number, unit?: string) {
	let response = new Intl.NumberFormat("en-US").format(value);
	if (unit) {
		response += ` ${unit}`;
	}
	return response;
}
