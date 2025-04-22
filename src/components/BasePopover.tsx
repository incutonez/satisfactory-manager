import { Popover as AriaPopover, PopoverProps as IPopover } from "react-aria-components";
import classNames from "classnames";

export type IBasePopover = IPopover;

export function BasePopover({ className, ...props }: IBasePopover) {
	className = classNames("rounded-md border bg-white shadow-lg", className);

	return (
		<AriaPopover
			className={className}
			offset={2}
			{...props}
		/>
	);
}
