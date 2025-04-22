import { Dispatch, ReactNode, SetStateAction, useEffect } from "react";
import {
	Button as BaseButton,
	ComboBox as BaseComboBox, ComboBoxProps,
	Input as BaseInput, Key,
	Label as BaseLabel,
	ListBox as BaseListBox,
	ListBoxItem as BaseListBoxItem,
} from "react-aria-components";
import classNames from "classnames";
import { BasePopover } from "@/components/BasePopover.tsx";
import { IconArrowDown } from "@/components/Icons.tsx";
import { getData } from "@/utils/common.ts";

export type TComboBoxValue = Key | null;

export interface IComboBox<TOption extends object, TKey = keyof TOption, TValue = unknown> extends Omit<ComboBoxProps<TOption>, "children"> {
	value?: TComboBoxValue;
	options: TOption[];
	valueField?: TKey;
	displayField?: TKey;
	setValue?: Dispatch<SetStateAction<TValue | undefined>> | ((value?: TValue) => void);
	setSelection?: (value?: TOption) => void;
	label?: string;
	children?: ReactNode | ((item: TOption) => ReactNode);
	listHeight?: number;
	inputCls?: string;
	labelCls?: string;
}

export function ComboBox<TOption extends object, TValue = unknown, TKey = keyof TOption>({ value, inputCls, labelCls, setValue, setSelection, options, label, children, menuTrigger = "focus", valueField = "value" as TKey, displayField = "display" as TKey, listHeight = 300, ...props }: IComboBox<TOption, TKey, TValue>) {
	let labelEl: ReactNode;
	inputCls = classNames("appearance-none rounded-md h-full outline-none ring-1 ring-inset ring-offset-0 ring-gray-500 enabled:focus:ring-sky-600 text-sm pl-2 pr-6 py-1", inputCls);
	if (label) {
		labelCls = classNames("text-sm uppercase font-semibold mr-2", labelCls);
		labelEl = (
			<BaseLabel className={labelCls}>
				{label}
				:
			</BaseLabel>
		);
	}
	children ??= (item) => {
		return (
			<BaseListBoxItem
				id={item[valueField as keyof TOption] as Key}
				className="hover:bg-sky-100 cursor-pointer p-2 text-sm data-[focus-visible]:bg-sky-100 aria-selected:bg-sky-200 aria-selected:font-semibold"
			>
				{getData(item, displayField as string)}
			</BaseListBoxItem>
		);
	};

	function onSelectionChange(key: Key | null) {
		if (setValue) {
			setValue(key as TValue);
		}
	}

	useEffect(() => {
		if (setSelection) {
			setSelection(options.find((option) => option[valueField as keyof TOption] === value));
		}
	}, [options, valueField, value, setSelection]);

	return (
		<BaseComboBox
			className="field-combo-box h-8 flex items-center"
			items={options}
			menuTrigger={menuTrigger}
			selectedKey={value}
			onSelectionChange={onSelectionChange}
			{...props}
		>
			{labelEl}
			<BaseInput className={inputCls} />
			<BaseButton className="relative cursor-pointer -ml-6">
				<IconArrowDown className="size-6" />
			</BaseButton>
			<BasePopover
				maxHeight={listHeight}
				className="w-(--trigger-width) overflow-auto"
			>
				<BaseListBox>
					{children}
				</BaseListBox>
			</BasePopover>
		</BaseComboBox>
	);
}
