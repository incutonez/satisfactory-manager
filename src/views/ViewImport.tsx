import { ChangeEvent, useRef, useState } from "react";
import { importInventoryThunk } from "@/api/inventory.ts";
import { BaseButton } from "@/components/BaseButton.tsx";
import { BaseDialog, IBaseDialog } from "@/components/BaseDialog.tsx";
import { FieldDisplay } from "@/components/FieldDisplay.tsx";
import { FieldText } from "@/components/FieldText.tsx";
import { IconSave } from "@/components/Icons.tsx";
import { useAppDispatch } from "@/store.ts";
import { IInventoryItem } from "@/types.ts";

export function ViewImport({ ...props }: IBaseDialog) {
	const dispatch = useAppDispatch();
	const [value, setValue] = useState<File>();
	const fileInputRef = useRef<HTMLInputElement>(null);
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
					dispatch(importInventoryThunk(JSON.parse(target.result as string) as IInventoryItem[]));
					props.setShow(false);
				}
			};
			reader.readAsText(value);
		}
	}

	function onFileChange({ target }: ChangeEvent<HTMLInputElement>) {
		setValue(target.files?.[0]);
	}

	function onClickSelectFile() {
		fileInputRef.current?.click();
	}

	return (
		<BaseDialog
			size="w-64"
			title="Import Data"
			footerSlot={footerSlot}
			bodyCls="space-y-2"
			{...props}
		>
			<BaseButton
				className="relative"
				onClick={onClickSelectFile}
			>
				<FieldText
					ref={fileInputRef}
					hidden={true}
					setter={setValue}
					type="file"
					className="size-full absolute"
					onChange={onFileChange}
				/>
				<span>Select File...</span>
			</BaseButton>
			<FieldDisplay
				value={value?.name}
				label="Selected"
			/>
		</BaseDialog>
	);
}
