import { Menu as AriaMenu, MenuProps as IAriaMenu } from "react-aria-components";

export type IBaseMenu<T extends object> = IAriaMenu<T>

export function BaseMenu<T extends object>({ ...props }: IBaseMenu<T>) {
	return (
		<AriaMenu {...props} />
	);
}
