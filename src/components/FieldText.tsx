import { ChangeEvent, ComponentProps, KeyboardEvent, ReactNode, useRef } from "react";
import classNames from "classnames";
import { FieldLabel } from "@/components/FieldLabel.tsx";
import { TSetTimeout } from "@/types.ts";
import { emptyFn } from "@/utils/common.ts";

export interface IFieldText<T = string> extends ComponentProps<"input"> {
	setter: (value?: T) => void;
	placeholder?: string;
	label?: string;
	typeDelay?: number;
	inputCls?: string;
	inputWidth?: string;
	labelCls?: string;
	labelPosition?: "top" | "left";
	onEnter?: (value: T) => void;
	onInputChange?: (value: string) => void;
}

export function FieldText({ value, autoFocus, onEnter, labelCls, labelPosition = "left", inputCls, inputWidth = "w-auto", type = "text", setter, label, onBlur = emptyFn, typeDelay = 250, onInputChange, placeholder }: IFieldText) {
	let labelEl: ReactNode;
	const typeDelayTimer = useRef<TSetTimeout>(undefined);
	const cls = ["flex"];
	inputCls = classNames("appearance-none rounded-md h-8 py-1 px-2 outline-none text-sm ring-1 ring-inset ring-offset-0 ring-gray-500 enabled:focus:ring-sky-600 bg-white text-gray-800 disabled:bg-gray-200 disabled:opacity-100 placeholder:text-gray-500", inputWidth);

	if (labelPosition === "top") {
		cls.push("flex-col");
	}
	else {
		cls.push("space-x-1 items-center");
	}

	function onChange({ target }: ChangeEvent<HTMLInputElement>) {
		const { value } = target;
		setter(value);
		if (onInputChange) {
			clearTimeout(typeDelayTimer.current);
			typeDelayTimer.current = setTimeout(() => onInputChange(value), typeDelay);
		}
	}

	function onKeyDown({ key }: KeyboardEvent<HTMLInputElement>) {
		if (key === "Enter" && onEnter) {
			onEnter(value as string);
		}
	}

	if (label) {
		labelEl = (
			<FieldLabel
				text={label}
				className={labelCls}
			/>
		);
	}
	return (
		<article className={cls.join(" ")}>
			{labelEl}
			<input
				autoFocus={autoFocus}
				type={type}
				className={inputCls}
				value={value}
				placeholder={placeholder}
				onChange={onChange}
				onKeyDown={onKeyDown}
				onBlur={onBlur}
			/>
		</article>
	);
}
