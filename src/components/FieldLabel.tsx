import { Label as AriaLabel, LabelProps as IAriaLabel } from "react-aria-components";
import classNames from "classnames";
import { IBaseComponent } from "@/types.ts";

export interface IFieldLabel extends IAriaLabel, IBaseComponent<HTMLLabelElement> {
	text?: string;
	separator?: string;
}

export function FieldLabel({ text, separator = ":", className }: IFieldLabel) {
	if (!text) {
		return;
	}
	className = classNames("mr-2 font-semibold text-gray-700 uppercase text-sm inline-block", className);

	return (
		<AriaLabel className={className}>
			{text}
			{separator}
		</AriaLabel>
	);
}
