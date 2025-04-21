import { ReactElement } from "react";
import {
	Dialog as AriaDialog,
	DialogTrigger as AriaDialogTrigger,
	DialogTriggerProps as IAriaDialogTrigger,
	OverlayArrow as AriaOverlayArrow,
} from "react-aria-components";
import { Placement as IAriaPlacement } from "@react-types/overlays";
import { BaseButton } from "@/components/BaseButton.tsx";
import { BasePopover } from "@/components/BasePopover.tsx";
import { IconArrowDropDown } from "@/components/Icons.tsx";

export interface ITooltipContext extends IAriaDialogTrigger {
	buttonConfig: ReactElement<typeof BaseButton>;
	placement?: IAriaPlacement;
}

export function TooltipContext({ children, placement = "end", buttonConfig, ...props }: ITooltipContext) {
	return (
		<AriaDialogTrigger {...props}>
			{buttonConfig}
			<BasePopover
				placement={placement}
				offset={8}
			>
				<AriaOverlayArrow className="overlay-arrow">
					<IconArrowDropDown className="relative size-10" />
				</AriaOverlayArrow>
				<AriaDialog className="overflow-hidden rounded-md">
					{children}
				</AriaDialog>
			</BasePopover>
		</AriaDialogTrigger>
	);
}
