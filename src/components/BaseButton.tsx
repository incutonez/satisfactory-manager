import { ElementType, isValidElement, ReactNode, RefObject, useEffect, useRef } from "react";
import { Button as AriaButton, ButtonProps as IAriaButton } from "react-aria-components";
import classNames from "classnames";
import { BaseIcon } from "@/components/BaseIcon.tsx";
import { IconLoading } from "@/components/IconLoading.tsx";

export interface IBaseButton extends IAriaButton {
	children?: ReactNode;
	text?: string | ReactNode;
	icon?: ElementType;
	iconCls?: string;
	iconAfter?: boolean;
	iconSlot?: ReactNode;
	size?: string;
	hidden?: boolean;
	color?: string;
	loading?: boolean;
	title?: string;
	plain?: boolean;
	ref?: RefObject<HTMLButtonElement>;
}

export function BaseButton({ children, plain, ref, title, text, color = "bg-slate-300 enabled:hover:bg-slate-400", loading = false, icon, iconSlot, hidden = false, size = "h-8", iconCls = "", className, iconAfter = false, ...attrs }: IBaseButton) {
	let textNode: ReactNode;
	let buttonIcon: ReactNode;
	const internalRef = useRef<HTMLButtonElement>(null);
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
		children = text;
	}
	else if (text) {
		children = text &&
            <span>
            	{text}
            </span>;
	}
	if (plain) {
		color = "";
	}
	const hiddenCls = hidden ? "hidden" : "";
	const disabledCls = attrs.isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
	const buttonCls = classNames("flex items-center rounded space-x-1", color, hiddenCls, size, disabledCls, textNode ? "px-2" : "px-1", className);

	function onRef(el: HTMLButtonElement) {
		if (ref) {
			ref.current = el;
		}
		internalRef.current = el;
	}

	useEffect(() => {
		if (title && internalRef.current) {
			internalRef.current.title = title;
		}
	}, [internalRef, title]);

	return (
		<AriaButton
			ref={onRef}
			className={buttonCls}
			{...attrs}
		>
			{!iconAfter && buttonIcon}
			{children}
			{iconAfter && buttonIcon}
		</AriaButton>
	);
}
