import { IMachine } from "@/types.ts";

export const machines = [{
	id: "constructor",
	image: "constructor.png",
	name: "Constructor",
}, {
	id: "smelter",
	image: "smelter.png",
	name: "Smelter",
}, {
	id: "blender",
	image: "blender.png",
	name: "Blender",
}, {
	id: "packager",
	image: "packager.png",
	name: "Packager",
}, {
	id: "converter",
	image: "converter.png",
	name: "Converter",
}, {
	id: "particleAccelerator",
	image: "particleAccelerator.png",
	name: "Particle Accelerator",
}, {
	id: "quantumEncoder",
	image: "quantumEncoder.png",
	name: "Quantum Encoder",
}, {
	id: "refinery",
	image: "refinery.png",
	name: "Refinery",
}, {
	id: "manufacturer",
	image: "manufacturer.png",
	name: "Manufacturer",
}, {
	id: "assembler",
	image: "assembler.png",
	name: "Assembler",
}, {
	id: "foundry",
	image: "foundry.png",
	name: "Foundry",
}, {
	id: "minerPortable",
	image: "minerPortable.png",
	name: "Portable Miner",
}, {
	id: "minerMk1",
	image: "minerMk1.png",
	name: "Miner Mk.1",
}, {
	id: "minerMk2",
	image: "minerMk2.png",
	name: "Miner Mk.2",
}, {
	id: "minerMk3",
	image: "minerMk3.png",
	name: "Miner Mk.3",
}] as const satisfies IMachine[];

machines.sort((lhs, rhs) => lhs.name.localeCompare(rhs.name));

export type TMachine = typeof machines[number]["id"];
