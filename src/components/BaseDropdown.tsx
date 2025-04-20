import { MenuTrigger as AriaMenuTrigger, MenuTriggerProps as IAriaMenu } from "react-aria-components";
import { BaseButton } from "@/components/BaseButton.tsx";
import { BaseMenu } from "@/components/BaseMenu.tsx";
import { BasePopover } from "@/components/BasePopover.tsx";
import { IconMenu } from "@/components/Icons.tsx";

export type IBaseDropdown = IAriaMenu;

export function BaseDropdown({ children, ...props }: IBaseDropdown) {
	return (
		<AriaMenuTrigger {...props}>
			<BaseButton
				aria-label="Menu"
				className="cursor-pointer"
				icon={IconMenu}
			>
			</BaseButton>
			<BasePopover>
				<BaseMenu className="text-sm">
					{children}
				</BaseMenu>
			</BasePopover>
		</AriaMenuTrigger>
	);
}
