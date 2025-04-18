import { ComponentProps } from "react";
import classNames from "classnames";

export interface IFieldLabel extends ComponentProps<"label"> {
	text?: string;
	separator?: string;
}

export function FieldLabel({ text, separator = ":", className }: IFieldLabel) {
	if (!text) {
		return;
	}
	className = classNames("mr-2 font-semibold text-gray-700 uppercase text-sm", className);
	return (
		<label className={className}>
			{text}
			{separator}
		</label>
	);
}
