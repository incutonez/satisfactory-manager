import { IKeyValue, INodeType } from "@/types.ts";

export const Miners = [{
	id: "minerPortable",
	name: "Portable Miner",
}, {
	id: "minerMk1",
	name: "Miner Mk.1",
}, {
	id: "minerMk2",
	name: "Miner Mk.2",
}, {
	id: "minerMk3",
	name: "Miner Mk.3",
}] as const satisfies IKeyValue[];

export type TMiner = typeof Miners[number]["id"];

export const NodeTypes = [{
	id: "impure",
	name: "Impure",
	amountPerMinute: 30,
}, {
	id: "normal",
	name: "Normal",
	amountPerMinute: 60,
}, {
	id: "pure",
	name: "Pure",
	amountPerMinute: 120,
}] as const satisfies INodeType[];

export type TNodeType = typeof NodeTypes[number]["id"];
