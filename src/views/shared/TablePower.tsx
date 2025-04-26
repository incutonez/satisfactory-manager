import { ComponentProps, useMemo } from "react";
import classNames from "classnames";
import { getTotalPower, getTotalPowerConsumption } from "@/api/power.ts";
import { useAppSelector } from "@/store.ts";
import { TMachinePowerType } from "@/types.ts";
import { formatNumber } from "@/utils/common.ts";

export interface ITablePower extends ComponentProps<"table"> {
	recipePower: number;
	powerType: TMachinePowerType;
	consumptionAdjustment?: number;
	totalPowerAdjustment?: number;
}

export function TablePower({ consumptionAdjustment = 0, totalPowerAdjustment = 0, recipePower, powerType, className }: ITablePower) {
	const totalPower = useAppSelector(getTotalPower) - totalPowerAdjustment;
	const currentConsumption = useAppSelector(getTotalPowerConsumption);
	recipePower = powerType === "produces" ? recipePower : -recipePower;
	let currentConsumptionAdjusted = useMemo(() => currentConsumption - consumptionAdjustment, [currentConsumption, consumptionAdjustment]);
	currentConsumptionAdjusted = currentConsumptionAdjusted ? -currentConsumptionAdjusted : currentConsumptionAdjusted;
	const remainingPower = useMemo(() => totalPower + currentConsumptionAdjusted + recipePower, [totalPower, currentConsumptionAdjusted, recipePower]);
	const remainingPowerBackground = useMemo(() => {
		if (remainingPower === 0) {
			return "bg-neutral-zero";
		}
		else if (remainingPower < 0) {
			return "bg-negative";
		}
		return "bg-positive";
	}, [remainingPower]);
	const recipePowerType = powerType === "produces" ? "Produces" : "Consumes";
	className = classNames("border-collapse", className);

	return (
		<table className={className}>
			<tbody>
				<tr>
					<td className="py-1 px-2 text-right">Total Power</td>
					<td className="py-1 px-2 text-right">
						{formatNumber(totalPower, "MW")}
					</td>
				</tr>
				<tr>
					<td className="py-1 px-2 text-right">Total Consumed</td>
					<td className="py-1 px-2 text-right">
						{formatNumber(currentConsumptionAdjusted, "MW")}
					</td>
				</tr>
				<tr>
					<td className="py-1 px-2 text-right border-b">
						Item
						{" "}
						{recipePowerType}
					</td>
					<td className="py-1 px-2 text-right border-b">
						{formatNumber(recipePower, "MW")}
					</td>
				</tr>
				<tr>
					<td className="py-1 px-2 text-right">Remaining Power</td>
					<td className={`py-1 px-2 text-right ${remainingPowerBackground}`}>
						{formatNumber(remainingPower, "MW")}
					</td>
				</tr>
			</tbody>
		</table>
	);
}
