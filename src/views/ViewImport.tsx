import { useState } from "react";
import { importInventoryThunk } from "@/api/inventory.ts";
import { BaseButton } from "@/components/BaseButton.tsx";
import { BaseDialog, IBaseDialog } from "@/components/BaseDialog.tsx";
import { FieldDisplay } from "@/components/FieldDisplay.tsx";
import { FieldFile } from "@/components/FieldFile.tsx";
import { IconSave } from "@/components/Icons.tsx";
import { useAppDispatch } from "@/store.ts";
import { IProductionImport } from "@/types.ts";

export function ViewImport({ ...props }: IBaseDialog) {
	const dispatch = useAppDispatch();
	const [value, setValue] = useState<File>();
	const footerSlot = (
		<BaseButton
			icon={IconSave}
			text="Save"
			onClick={onClickSave}
		/>
	);

	function onClickSave() {
		if (value) {
			const reader = new FileReader();
			reader.onload = ({ target }) => {
				if (target) {
					dispatch(importInventoryThunk(JSON.parse(target.result as string) as IProductionImport));
					props.setShow(false);
				}
			};
			reader.readAsText(value);
		}
	}

	function onSelectFile(files: FileList | null) {
		if (files) {
			setValue(files[0]);
		}
	}

	return (
		<BaseDialog
			size="w-64"
			title="Import Data"
			footerSlot={footerSlot}
			bodyCls="space-y-2"
			{...props}
		>
			<FieldFile onSelect={onSelectFile} />
			<FieldDisplay
				value={value?.name}
				label="Selected"
			/>
		</BaseDialog>
	);
}
