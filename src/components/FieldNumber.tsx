import { NumberField as AriaNumberField, NumberFieldProps as IAriaNumberField } from "react-aria-components";
import { BaseField } from "@/components/BaseField.tsx";
import { FieldLabel, IFieldLabel } from "@/components/FieldLabel.tsx";
import { IBaseComponent } from "@/types.ts";

export interface IFieldNumber extends IAriaNumberField, IBaseComponent<HTMLInputElement> {
	label?: string;
	labelCls?: string;
	labelConfig?: IFieldLabel;
	inputCls?: string;
	inputWidth?: string;
}

/**
 * Currently, this component does not allow updating with the onChange event... it's triggered when the field loses
 * focus OR the enter key is pressed.
 * Source: https://github.com/adobe/react-spectrum/issues/7984
 */
export function FieldNumber({ label, labelCls, labelConfig, inputCls, inputWidth, ...props }: IFieldNumber) {
	return (
		<AriaNumberField {...props}>
			<FieldLabel
				text={label}
				className={labelCls}
				{...labelConfig}
			/>
			<BaseField
				inputWidth={inputWidth}
				className={inputCls}
			/>
		</AriaNumberField>
	);
}
