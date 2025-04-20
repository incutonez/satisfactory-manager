import justCapitalize from "just-capitalize";
import MimeTypes from "mime-types";
import { ICalculateAmountDisplays, IInventoryRecipe, TItemKey } from "@/types.ts";

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

export function calculateSomersloop(somersloop: number) {
	return 1 + (somersloop / 4);
}

export function calculateAmountDisplays({ items, overclock, somersloop, machineCount }: ICalculateAmountDisplays) {
	overclock /= 100;
	somersloop = calculateSomersloop(somersloop);
	const multiplier = overclock * machineCount * somersloop;
	items.forEach((item) => {
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
