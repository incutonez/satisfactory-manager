import { IMachine } from "@/types.ts";

export const machines = [{
	image: "portableMiner.png",
	id: "portableMiner",
	powerType: "consumes",
	name: "Portable Miner",
	basePower: 0,
}, {
	image: "coalPoweredGenerator.png",
	powerType: "produces",
	name: "Coal-Powered Generator",
	id: "coalPoweredGenerator",
	basePower: 75,
}, {
	image: "waterExtractor.png",
	powerType: "consumes",
	name: "Water Extractor",
	id: "waterExtractor",
	basePower: 20,
}, {
	image: "quantumEncoder.png",
	powerType: "consumes",
	name: "Quantum Encoder",
	id: "quantumEncoder",
	basePower: 0,
}, {
	image: "converter.png",
	powerType: "consumes",
	name: "Converter",
	id: "converter",
	basePower: 0,
}, {
	image: "oilExtractor.png",
	powerType: "consumes",
	name: "Oil Extractor",
	id: "oilExtractor",
	basePower: 40,
}, {
	image: "refinery.png",
	powerType: "consumes",
	name: "Refinery",
	id: "refinery",
	basePower: 30,
}, {
	image: "foundry.png",
	powerType: "consumes",
	name: "Foundry",
	id: "foundry",
	basePower: 16,
}, {
	image: "packager.png",
	powerType: "consumes",
	name: "Packager",
	id: "packager",
	basePower: 10,
}, {
	image: "minerMk2.png",
	powerType: "consumes",
	name: "Miner Mk.2",
	id: "minerMk2",
	basePower: 15,
}, {
	image: "manufacturer.png",
	powerType: "consumes",
	name: "Manufacturer",
	id: "manufacturer",
	basePower: 55,
}, {
	image: "assembler.png",
	powerType: "consumes",
	name: "Assembler",
	id: "assembler",
	basePower: 15,
}, {
	image: "particleAccelerator.png",
	powerType: "consumes",
	name: "Particle Accelerator",
	id: "particleAccelerator",
	basePower: 0,
}, {
	image: "blender.png",
	powerType: "consumes",
	name: "Blender",
	id: "blender",
	basePower: 75,
}, {
	image: "nuclearPowerGenerator.png",
	powerType: "produces",
	name: "Nuclear Power Plant",
	id: "nuclearPowerGenerator",
	basePower: 2500,
}, {
	image: "resourceWellExtractor.png",
	powerType: "consumes",
	name: "Resource Well Extractor",
	id: "resourceWellExtractor",
	basePower: 0,
}, {
	image: "minerMk3.png",
	powerType: "consumes",
	name: "Miner Mk.3",
	id: "minerMk3",
	basePower: 45,
}, {
	image: "fuelPoweredGenerator.png",
	powerType: "produces",
	name: "Fuel-Powered Generator",
	id: "fuelPoweredGenerator",
	basePower: 250,
}, {
	/* This one gets a little complicated... it generates 500, but then has a multiplier of 10% of the grid's power, up to 30%
	 * Source: https://satisfactory.wiki.gg/wiki/Alien_Power_Augmenter#Usage */
	image: "alienPowerGenerator.png",
	powerType: "produces",
	name: "Alien Power Augmenter",
	id: "alienPowerGenerator",
	basePower: 500,
}, {
	// Can have impure, normal, and pure nodeTypes
	image: "geothermalGenerator.png",
	powerType: "produces",
	name: "Geothermal Generator",
	id: "geothermalGenerator",
	// Average value for pure nodeType
	basePower: 400,
}, {
	image: "biomassBurner.png",
	powerType: "produces",
	name: "Biomass Burner",
	id: "biomassBurner",
	basePower: 30,
}, {
	image: "minerMk1.png",
	powerType: "consumes",
	name: "Miner Mk.1",
	id: "minerMk1",
	basePower: 5,
}, {
	image: "constructor.png",
	powerType: "consumes",
	name: "Constructor",
	id: "constructor",
	basePower: 4,
}, {
	image: "smelter.png",
	powerType: "consumes",
	name: "Smelter",
	id: "smelter",
	basePower: 4,
}] as const satisfies IMachine[];

machines.sort((lhs, rhs) => lhs.name.localeCompare(rhs.name));

export const machineGenerators = machines.filter(({ powerType }) => powerType === "produces");

export type TMachine = typeof machines[number]["id"];
