import { copyFileSync, writeFileSync } from "fs";
import camelCase from "just-camel-case";
import path from "path";
import data from "./satisfactory.json";
import { IInventoryItem, IMachine, IRecipe, IRecipeItem, TItemKey } from "./types.ts";
import { capitalizeFirstLetters } from "./utils/common.ts";

export interface ISatisfactoryData {
	items: ISatisfactoryItem[];
	recipes: ISatisfactoryRecipe[];
}

export interface ISatisfactoryItem {
	slug: string;
	icon: string;
	name: string;
	description: string;
	sinkPoints: number;
	className: string;
	stackSize: number;
	energyValue: number;
	radioactiveDecay: number;
	liquid: boolean;
	fluidColor: {
		r: number;
		g: number;
		b: number;
		a: number;
	};
}

export interface ISatisfactoryRecipe {
	slug: string;
	name: string;
	className: string;
	alternate: boolean;
	time: number;
	inHand: boolean;
	forBuilding: boolean;
	inWorkshop: boolean;
	inMachine: boolean;
	// This is the number added to manual crafting of this item
	manualTimeMultiplier: number;
	ingredients: {
		item: string;
		amount: number;
	}[];
	products: {
		item: string;
		amount: number;
	}[];
	producedIn: string[];
	isVariablePower: boolean;
	minPower: number;
	maxPower: number;
}

const machinesOut: IMachine[] = [];
const inventoryMapping: Record<string, string> = {};
const itemsOut: IInventoryItem[] = [];
const recipesOut: IRecipe[] = [];
const CopyItems = false;
const CopyRecipes = true;
const CopyMachines = false;
const ReadOnly = false;
const OutputDir = path.join("./src", "api");
const { items, recipes } = data as unknown as ISatisfactoryData;

const ImageDir = path.join("/Users", "incut", "workspace", "SatisfactoryTools", "www", "assets", "images", "items");
for (const key in items) {
	const item = items[key];
	const id = camelCase(item.slug) as TItemKey;
	const image = `${id}.png`;
	inventoryMapping[item.className] = id;
	itemsOut.push({
		id,
		image,
		name: item.name,
		recipes: [],
		producingTotal: 0,
		consumingTotal: 0,
		total: 0,
	});
	if (CopyItems && !ReadOnly) {
		copyFileSync(path.join(ImageDir, `${item.icon}_256.png`), path.join("./public", image));
	}
}

for (const key in recipes) {
	const recipe = recipes[key];
	const productionCycleTime = recipe.time;
	const cyclesPerMinute = 60 / productionCycleTime;
	const id = camelCase(recipe.slug);
	const items: IRecipeItem[] = [];
	recipe.ingredients.forEach((ingredient) => {
		items.push({
			recipeType: "consumes",
			amountPerCycleDisplay: 0,
			amountPerMinuteDisplay: 0,
			itemId: inventoryMapping[ingredient.item] as TItemKey,
			amountPerCycle: ingredient.amount,
			amountPerMinute: ingredient.amount * cyclesPerMinute,
		});
	});
	recipe.products.forEach((product) => {
		items.push({
			recipeType: "produces",
			amountPerCycleDisplay: 0,
			amountPerMinuteDisplay: 0,
			itemId: inventoryMapping[product.item] as TItemKey,
			amountPerCycle: product.amount,
			amountPerMinute: product.amount * cyclesPerMinute,
		});
	});
	recipe.producedIn = recipe.producedIn.map((machineKey) => {
		let id = camelCase(machineKey.replace(/^Desc_|Mk1_C$|_C$/g, ""));
		if (id === "oilRefinery") {
			id = "refinery";
		}
		else if (id === "hadronCollider") {
			id = "particleAccelerator";
		}
		const image = `${id}.png`;
		const found = machinesOut.find((machine) => machine.id === id);
		if (!found) {
			machinesOut.push({
				id,
				image,
				name: capitalizeFirstLetters(id),
			});
			if (CopyMachines && !ReadOnly) {
				copyFileSync(path.join(ImageDir, `${machineKey.replace(/_/g, "-").toLowerCase()}_256.png`), path.join("./public", image));
			}
		}
		return id;
	});
	recipesOut.push({
		id,
		productionCycleTime,
		cyclesPerMinute,
		items,
		name: recipe.name,
		isAlternate: recipe.alternate,
		producedIn: recipe.producedIn,
	});
}

if (CopyItems && !ReadOnly) {
	writeFileSync(path.join(OutputDir, "inventory.json"), JSON.stringify(itemsOut));
}
if (CopyRecipes && !ReadOnly) {
	writeFileSync(path.join(OutputDir, "recipes.json"), JSON.stringify(recipesOut));
}
if (CopyMachines && !ReadOnly) {
	writeFileSync(path.join(OutputDir, "machines.json"), JSON.stringify(machinesOut));
}
