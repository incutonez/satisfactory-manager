import { useEffect, useState } from "react";
import { updateFactoryThunk } from "@/api/factories.ts";
import { BaseButton } from "@/components/BaseButton.tsx";
import { BaseDialog, IBaseDialog } from "@/components/BaseDialog.tsx";
import { FieldText } from "@/components/FieldText.tsx";
import { IconSave } from "@/components/Icons.tsx";
import { useAppDispatch } from "@/store.ts";

export interface IViewFactory extends IBaseDialog {
	isEdit: boolean;
	factoryName?: string;
}

export function ViewFactory({ isEdit, factoryName = "", setShow, ...props }: IViewFactory) {
	const dispatch = useAppDispatch();
	const [name, setName] = useState<string | undefined>(factoryName);
	const factoryDialogFooter = (
		<BaseButton
			text="Save"
			icon={IconSave}
			isDisabled={!name}
			onClick={onClickSaveFactory}
		/>
	);

	useEffect(() => {
		if (props.show) {
			setName(factoryName);
		}
		else {
			setName("");
		}
	}, [props.show, factoryName]);

	function saveFactory() {
		if (!name) {
			return;
		}
		dispatch(updateFactoryThunk(name, isEdit));
		setShow(false);
	}

	function onEnterFactory() {
		saveFactory();
	}

	function onClickSaveFactory() {
		saveFactory();
	}

	return (
		<BaseDialog
			{...props}
			setShow={setShow}
			title={isEdit ? "Edit Factory" : "Add Factory"}
			size="size-fit"
			bodyCls="p-4"
			footerSlot={factoryDialogFooter}
		>
			<article>
				<FieldText
					label="Name"
					autoFocus={true}
					value={name}
					onChange={setName}
					onEnter={onEnterFactory}
				/>
			</article>
		</BaseDialog>
	);
}
