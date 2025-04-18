import { ComponentProps, ElementType, isValidElement, ReactNode } from "react";
import classNames from "classnames";
import { BaseIcon } from "@/components/BaseIcon.tsx";
import { IconLoading } from "@/components/IconLoading.tsx";

export type IBaseButton<T extends ElementType = "button"> = ComponentProps<T> & {
	text?: string | ReactNode;
	icon?: ElementType;
	iconCls?: string;
	iconAfter?: boolean;
	iconSlot?: ReactNode;
	size?: string;
	hidden?: boolean;
	color?: string;
	loading?: boolean;
}

export function BaseButton({ text, color = "bg-slate-300 enabled:hover:bg-slate-400", loading = false, icon, iconSlot, hidden = false, size = "h-8", iconCls = "", className, iconAfter = false, ...attrs }: IBaseButton) {
	let textNode: ReactNode;
	let buttonIcon: ReactNode;
	if (loading) {
		buttonIcon = <IconLoading />;
	}
	else if (iconSlot) {
		buttonIcon = iconSlot;
	}
	else if (icon) {
		buttonIcon = (
			<BaseIcon
				as={icon}
				className={iconCls}
			/>
		);
	}
	if (isValidElement(text)) {
		textNode = text;
	}
	else if (text) {
		textNode = text &&
            <span>
            	{text}
            </span>;
	}
	const hiddenCls = hidden ? "hidden" : "";
	const disabledCls = attrs.disabled ? "opacity-70 cursor-not-allowed" : "cursor-pointer";
	const buttonCls = classNames("flex items-center rounded space-x-1", color, hiddenCls, size, disabledCls, textNode ? "px-2" : "px-1", className);
	return (
		<button
			className={buttonCls}
			{...attrs}
		>
			{!iconAfter && buttonIcon}
			{textNode}
			{iconAfter && buttonIcon}
		</button>
	);
}
