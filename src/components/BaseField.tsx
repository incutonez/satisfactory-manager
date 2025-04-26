import { ChangeEvent, useRef } from "react";
import { Input as AriaInput, InputProps as IAriaInput } from "react-aria-components";
import classNames from "classnames";
import { IBaseComponent, TSetTimeout } from "@/types.ts";

export interface IBaseField extends IAriaInput, IBaseComponent<HTMLInputElement> {
	inputWidth?: string;
	typeDelay?: number;
	onInputChange?: (value: string) => void;
}

export function BaseField({ className, onChange, inputWidth = "w-auto", onInputChange, value, typeDelay = 250, ...props }: IBaseField) {
	const typeDelayTimer = useRef<TSetTimeout>(undefined);
	className = classNames("base-field", className, inputWidth);

	function onFieldChange(event: ChangeEvent<HTMLInputElement>) {
		const { value } = event.target;
		if (onChange) {
			onChange(event);
		}
		if (onInputChange) {
			clearTimeout(typeDelayTimer.current);
			typeDelayTimer.current = setTimeout(() => onInputChange(value), typeDelay);
		}
	}

	return (
		<AriaInput
			{...props}
			value={value}
			className={className}
			onChange={onFieldChange}
		/>
	);
}
