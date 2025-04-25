import { KeyboardEvent, ReactNode } from "react";
import { TextField as AriaTextField, TextFieldProps as IAriaTextField } from "react-aria-components";
import { BaseField } from "@/components/BaseField.tsx";
import { FieldLabel } from "@/components/FieldLabel.tsx";

export interface IFieldText extends IAriaTextField {
	label?: string;
	labelCls?: string;
	labelPosition?: "top" | "left";
	inputCls?: string;
	inputWidth?: string;
	wrapperCls?: string;
	placeholder?: string;
	onEnter?: (value: string | undefined) => void;
}

export function FieldText({ className, inputWidth, placeholder, onEnter, inputCls, labelCls, labelPosition = "left", label, ...props }: IFieldText) {
	let labelEl: ReactNode;
	const cls = ["flex", className];

	if (labelPosition === "top") {
		cls.push("flex-col");
	}
	else {
		cls.push("space-x-1 items-center");
	}

	if (label) {
		labelEl = (
			<FieldLabel
				text={label}
				className={labelCls}
			/>
		);
	}

	function onKeyDown({ key }: KeyboardEvent<HTMLInputElement>) {
		if (key === "Enter" && onEnter) {
			onEnter(props.value);
		}
	}

	return (
		<AriaTextField
			className={cls.join(" ")}
			onKeyDown={onKeyDown}
			{...props}
		>
			{labelEl}
			<BaseField
				inputWidth={inputWidth}
				className={inputCls}
				placeholder={placeholder}
			/>
		</AriaTextField>
	);
}
