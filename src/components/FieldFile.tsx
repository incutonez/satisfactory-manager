import { FileTrigger as AriaFileTrigger, FileTriggerProps as IAriaFileTrigger } from "react-aria-components";
import { BaseButton } from "@/components/BaseButton.tsx";

export interface IFieldFile extends IAriaFileTrigger {
	text?: string;
}

export function FieldFile({ text = "Select File...", ...props }: IFieldFile) {
	return (
		<AriaFileTrigger {...props}>
			<BaseButton text={text} />
		</AriaFileTrigger>
	);
}
