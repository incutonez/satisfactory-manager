import { ReactElement } from "react";
import { TabList as AriaTabList, Tabs as AriaTabs, TabsProps as IAriaTabs } from "react-aria-components";
import classNames from "classnames";
import { BaseTab } from "@/components/BaseTab.tsx";
import { BaseTabContents } from "@/components/BaseTabContents.tsx";

export interface IBaseTabs extends IAriaTabs {
	tabs: ReactElement<typeof BaseTab>;
	children: ReactElement<typeof BaseTabContents>;
}

export function BaseTabs({ className, tabs, children, ...props }: IBaseTabs) {
	className = classNames("base-tabs", className);

	return (
		<AriaTabs
			className={className}
			{...props}
		>
			<AriaTabList className="tab-list">
				{tabs}
			</AriaTabList>
			{children}
		</AriaTabs>
	);
}
