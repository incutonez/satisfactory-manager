import { IMachine } from "@/types.ts";

export const machines = [{
	id: "constructor",
	image: "constructor.png",
	name: "Constructor",
	basePower: 4,
	powerType: "consumes",
}, {
	id: "smelter",
	image: "smelter.png",
	name: "Smelter",
	basePower: 4,
	powerType: "consumes",
}, {
	id: "blender",
	image: "blender.png",
	name: "Blender",
	basePower: 75,
	powerType: "consumes",
}, {
	id: "packager",
	image: "packager.png",
	name: "Packager",
	basePower: 10,
	powerType: "consumes",
}, {
	id: "converter",
	image: "converter.png",
	name: "Converter",
	basePower: 0,
	powerType: "consumes",
}, {
	id: "particleAccelerator",
	image: "particleAccelerator.png",
	name: "Particle Accelerator",
	basePower: 0,
	powerType: "consumes",
}, {
	id: "quantumEncoder",
	image: "quantumEncoder.png",
	name: "Quantum Encoder",
	basePower: 0,
	powerType: "consumes",
}, {
	id: "refinery",
	image: "refinery.png",
	name: "Refinery",
	basePower: 30,
	powerType: "consumes",
}, {
	id: "manufacturer",
	image: "manufacturer.png",
	name: "Manufacturer",
	basePower: 55,
	powerType: "consumes",
}, {
	id: "assembler",
	image: "assembler.png",
	name: "Assembler",
	basePower: 15,
	powerType: "consumes",
}, {
	id: "foundry",
	image: "foundry.png",
	name: "Foundry",
	basePower: 16,
	powerType: "consumes",
}, {
	id: "minerPortable",
	image: "minerPortable.png",
	name: "Portable Miner",
	basePower: 0,
	powerType: "consumes",
}, {
	id: "minerMk1",
	image: "minerMk1.png",
	name: "Miner Mk.1",
	basePower: 5,
	powerType: "consumes",
}, {
	id: "minerMk2",
	image: "minerMk2.png",
	name: "Miner Mk.2",
	basePower: 15,
	powerType: "consumes",
}, {
	id: "minerMk3",
	image: "minerMk3.png",
	name: "Miner Mk.3",
	basePower: 45,
	powerType: "consumes",
}, {
	id: "waterExtractor",
	image: "waterExtractor.png",
	name: "Water Extractor",
	basePower: 20,
	powerType: "consumes",
}, {
	id: "oilExtractor",
	image: "oilExtractor.png",
	name: "Oil Extractor",
	basePower: 40,
	powerType: "consumes",
}, {
	id: "resourceWellExtractor",
	image: "resourceWellExtractor.png",
	name: "Resource Well Extractor",
	basePower: 150,
	powerType: "consumes",
}, {
	id: "biomassBurner",
	image: "biomassBurner.png",
	name: "Biomass Burner",
	basePower: 30,
	powerType: "produces",
}, {
	id: "coalPoweredGenerator",
	image: "coalPoweredGenerator.png",
	name: "Coal-Powered Generator",
	basePower: 75,
	powerType: "produces",
}, {
	id: "fuelPoweredGenerator",
	image: "fuelPoweredGenerator.png",
	name: "Fuel-Powered Generator",
	basePower: 250,
	powerType: "produces",
}, {
	// Can have impure, normal, and pure nodeTypes
	id: "geothermalGenerator",
	image: "geothermalGenerator.png",
	name: "Geothermal Generator",
	// Average value for pure nodeType
	basePower: 400,
	powerType: "produces",
}, {
	id: "nuclearPowerGenerator",
	image: "nuclearPowerGenerator.png",
	name: "Nuclear Power Generator",
	basePower: 2500,
	powerType: "produces",
}, {
	/* This one gets a little complicated... it generates 500, but then has a multiplier of 10% of the grid's power, up to 30%
	 * Source: https://satisfactory.wiki.gg/wiki/Alien_Power_Augmenter#Usage */
	id: "alienPowerGenerator",
	image: "alienPowerGenerator.png",
	name: "Alien Power Generator",
	basePower: 500,
	powerType: "produces",
}] as const satisfies IMachine[];

machines.sort((lhs, rhs) => lhs.name.localeCompare(rhs.name));

export type TMachine = typeof machines[number]["id"];
