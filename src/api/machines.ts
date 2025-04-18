import defaultMachines from "@/api/machines.json";
import { IMachine } from "@/types.ts";

export const machines = defaultMachines as IMachine[];
machines.sort((lhs, rhs) => lhs.name.localeCompare(rhs.name));
