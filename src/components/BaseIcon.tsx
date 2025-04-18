import { ComponentProps, ElementType } from "react";
import classNames from "classnames";

type Props<T extends ElementType> = {
	as: T;
	size?: string;
} & ComponentProps<T>;

export function BaseIcon<T extends ElementType = "svg">({ as = "svg", size = "size-6", className = "" }: Props<T>) {
	const Component = as;
	return (
		<Component className={classNames(size, className)} />
	);
}
