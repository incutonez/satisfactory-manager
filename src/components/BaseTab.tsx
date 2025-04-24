import { Tab as AriaTab, TabProps as IAriaTab } from "react-aria-components";
import classNames from "classnames";

export interface IBaseTab extends IAriaTab {
	text?: string;
}

export function BaseTab({ className, children, text, ...props }: IBaseTab) {
	className = classNames("tab-header", className);
	if (text) {
		children = (
			<span>
				{text}
			</span>
		);
	}

	return (
		<AriaTab
			className={className}
			{...props}
		>
			{children}
		</AriaTab>
	);
}
