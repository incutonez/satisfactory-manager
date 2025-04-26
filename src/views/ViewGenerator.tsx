import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { machineGenerators, TMachine } from "@/api/machines.ts";
import { getActivePowerItem, savePowerGeneratorThunk } from "@/api/power.ts";
import { BaseButton } from "@/components/BaseButton.tsx";
import { BaseDialog, IBaseDialog } from "@/components/BaseDialog.tsx";
import { ComboBox } from "@/components/ComboBox.tsx";
import { FieldNumber } from "@/components/FieldNumber.tsx";
import { IconSave } from "@/components/Icons.tsx";
import { RouteViewPower } from "@/routes.ts";
import { useAppDispatch, useAppSelector } from "@/store.ts";
import { IMachine } from "@/types.ts";
import { uuid } from "@/utils/common.ts";
import { RecipeMachine } from "@/views/shared/CellItem.tsx";
import { TablePower } from "@/views/shared/TablePower.tsx";

export interface IViewGenerator extends IBaseDialog {
	recordId?: string;
}

export function ViewGenerator({ footerSlot, ...props }: IViewGenerator) {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const record = useAppSelector(getActivePowerItem);
	const [machineId, setMachineId] = useState<TMachine | "">("");
	const [overclock, setOverclock] = useState(100);
	const [count, setCount] = useState(1);
	const [selectedMachine, setSelectedMachine] = useState<IMachine>();
	const totalOutput = useMemo(() => (overclock / 100) * count * (selectedMachine?.basePower ?? 1), [overclock, count, selectedMachine?.basePower]);
	let machineNode;

	useEffect(() => {
		if (record) {
			setMachineId(record.machineId ?? "");
			setOverclock(record.overclock ?? 100);
			setCount(record.count ?? 1);
		}
	}, [record]);

	if (!record) {
		return;
	}

	const title = record.id ? "Edit Generator" : "Add Generator";

	if (selectedMachine) {
		machineNode = (
			<section className="flex items-center">
				<RecipeMachine
					size="size-56"
					arrowSize="size-18"
					showLeftArrow={false}
					machineId={selectedMachine?.id}
				/>
				<TablePower
					className="ml-4"
					recipePower={totalOutput}
					totalPowerAdjustment={record?.basePower}
					powerType="produces"
				/>
			</section>
		);
	}

	footerSlot ??= (
		<BaseButton
			text="Save"
			icon={IconSave}
			onClick={onClickSaveFactory}
		/>
	);

	function onClickSaveFactory() {
		if (machineId) {
			dispatch(savePowerGeneratorThunk({
				count,
				overclock,
				machineId,
				name: selectedMachine?.name ?? "",
				id: record?.id ?? uuid(),
				image: "",
				powerType: "produces",
				basePower: totalOutput,
			}));
			navigate({
				to: RouteViewPower,
			});
		}
	}

	return (
		<BaseDialog
			{...props}
			bodyCls="p-4"
			size="h-9/10 w-1/2"
			title={title}
			footerSlot={footerSlot}
		>
			<article className="flex flex-col space-y-2 size-full [&_label]:w-26 [&_input]:w-54">
				<section className="flex flex-col space-y-2">
					<ComboBox
						label="Generator"
						value={machineId}
						setValue={setMachineId}
						setSelection={setSelectedMachine}
						options={machineGenerators}
						valueField="id"
						displayField="name"
						isRequired={true}
					/>
					<FieldNumber
						label="Overclock %"
						value={overclock}
						isRequired={true}
						minValue={0}
						maxValue={250}
						onChange={setOverclock}
					/>
					<FieldNumber
						label="Count"
						value={count}
						isRequired={true}
						minValue={0}
						defaultValue={1}
						onChange={setCount}
					/>
				</section>
				{machineNode}
			</article>
		</BaseDialog>
	);
}
