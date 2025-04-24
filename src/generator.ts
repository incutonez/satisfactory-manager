import { copyFileSync, writeFileSync } from "fs";
import camelCase from "just-camel-case";
import path from "path";
import { TMachine } from "@/api/machines.ts";
import data from "./satisfactory.json";
import { IInventoryItem, IMachine, IRecipe, IRecipeItem, TItemKey, TMachinePowerType } from "./types.ts";

const validMachines: TMachine[] = [
	"constructor",
	"smelter",
	"blender",
	"packager",
	"converter",
	"particleAccelerator",
	"quantumEncoder",
	"refinery",
	"manufacturer",
	"assembler",
	"foundry",
	"minerMk1",
	"minerMk2",
	"minerMk3",
	"waterExtractor",
	"oilExtractor",
	"resourceWellExtractor",
	"biomassBurner",
	"coalPoweredGenerator",
	"fuelPoweredGenerator",
	"geothermalGenerator",
	"nuclearPowerGenerator",
	"alienPowerGenerator",
];

export interface ISatisfactoryBuilding {
	slug: string;
	icon: string;
	name: string;
	description: string;
	className: string;
	categories: unknown[];
	buildMenuPriority: number;
	metadata: {
		powerConsumption: number;
		powerConsumptionExponent: number;
		manufacturingSpeed: number;
	};
	size: {
		width: number;
		height: number;
		length: number;
	};
}

export interface ISatisfactoryData {
	items: Record<string, ISatisfactoryItem>;
	recipes: Record<string, ISatisfactoryRecipe>;
	buildings: Record<string, ISatisfactoryBuilding>;
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
const CopyMachines = true;
const ReadOnly = false;
const OutputDir = path.join("./src", "api");
const { items, recipes, buildings } = data as unknown as ISatisfactoryData;

const ImageDir = path.join("/Users", "incut", "workspace", "SatisfactoryTools", "www", "assets", "images", "items");
for (const key in items) {
	const item = items[key];
	const id = camelCase(item.slug) as TItemKey;
	const image = `${id}.png`;
	inventoryMapping[item.className] = id;
	if (item.slug === "portable-miner") {
		if (CopyMachines && !ReadOnly) {
			copyFileSync(path.join(ImageDir, `${item.icon}_256.png`), path.join("./public", image));
		}
		machinesOut.push({
			image,
			id,
			powerType: "consumes",
			name: item.name,
			basePower: 0,
		});
		continue;
	}
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

for (const key in buildings) {
	const building = buildings[key];
	if (building.slug === "alien-power-augmenter") {
		building.slug = "alienPowerGenerator";
	}
	else if (building.slug === "nuclear-power-plant") {
		building.slug = "nuclearPowerGenerator";
	}
	const machineKey = camelCase(building.slug) as TMachine;
	if (!validMachines.includes(machineKey)) {
		continue;
	}
	const image = `${machineKey}.png`;
	if (CopyMachines && !ReadOnly) {
		copyFileSync(path.join(ImageDir, `${building.icon}_256.png`), path.join("./public", image));
	}
	let powerType: TMachinePowerType = "consumes";
	let { powerConsumption } = building.metadata;
	if (!powerConsumption) {
		powerType = "produces";
		switch (machineKey) {
			case "biomassBurner":
				powerConsumption = 30;
				break;
			case "coalPoweredGenerator":
				powerConsumption = 75;
				break;
			case "fuelPoweredGenerator":
				powerConsumption = 250;
				break;
			case "geothermalGenerator":
				powerConsumption = 400;
				break;
			case "nuclearPowerGenerator":
				powerConsumption = 2500;
				break;
			case "alienPowerGenerator":
				powerConsumption = 500;
				break;
			default:
				// This means we're dealing with the Particle Accelerator, Converter, etc.
				powerType = "consumes";
		}
	}
	machinesOut.push({
		image,
		powerType,
		name: building.name,
		id: machineKey,
		basePower: powerConsumption,
	});
}

for (const key in recipes) {
	const recipe = recipes[key];
	if (!recipe.producedIn.length) {
		continue;
	}
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
	const producedIn = recipe.producedIn.map((machineKey) => {
		let id = camelCase(machineKey.replace(/^Desc_|Mk1_C$|_C$/g, ""));
		if (id === "oilRefinery") {
			id = "refinery";
		}
		else if (id === "hadronCollider") {
			id = "particleAccelerator";
		}
		return id;
	})[0] as TMachine;
	const foundMachine = machinesOut.find(({ id }) => id === producedIn);
	recipesOut.push({
		id,
		productionCycleTime,
		cyclesPerMinute,
		items,
		producedIn,
		basePower: recipe.isVariablePower ? recipe.maxPower : foundMachine?.basePower ?? 1,
		name: recipe.name,
		isAlternate: recipe.alternate,
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
