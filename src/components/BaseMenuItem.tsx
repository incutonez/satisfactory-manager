import { ElementType, ReactNode } from "react";
import { MenuItem as AriaMenuItem, MenuItemProps as IMenuItem } from "react-aria-components";
import classNames from "classnames";
import { BaseIcon } from "@/components/BaseIcon.tsx";

export interface IBaseMenuItem<T extends object> extends IMenuItem<T> {
	children?: ReactNode;
	cls?: string;
	text?: string;
	icon?: ElementType;
	iconSlot?: ReactNode;
	iconCls?: string;
}

export function BaseMenuItem<T extends object>({ icon, iconSlot, iconCls, children, text, cls, ...props }: IBaseMenuItem<T>) {
	let buttonIcon: ReactNode;
	cls = classNames("p-2 hover:bg-sky-200 flex items-center space-x-1", props.isDisabled ? "opacity-60 cursor-not-allowed pointer-events-none" : "cursor-pointer");
	if (text) {
		children = (
			<span>
				{text}
			</span>
		);
	}
	if (iconSlot) {
		buttonIcon = iconSlot;
	}
	else if (icon) {
		buttonIcon = (
			<BaseIcon
				as={icon}
				className={iconCls}
				size="size-4.5"
			/>
		);
	}

	return (
		<AriaMenuItem
			className={cls}
			{...props}
		>
			{buttonIcon}
			{children}
		</AriaMenuItem>
	);
}
