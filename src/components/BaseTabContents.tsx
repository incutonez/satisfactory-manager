import { TabPanel as AriaTabPanel, TabPanelProps as IAriaTabPanel } from "react-aria-components";

export type IBaseTabContents = IAriaTabPanel

export function BaseTabContents({ ...props }: IBaseTabContents) {
	return (
		<AriaTabPanel {...props} />
	);
}
