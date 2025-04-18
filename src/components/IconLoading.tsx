import { ComponentProps } from "react";
import classNames from "classnames";
import { BaseIcon } from "@/components/BaseIcon.tsx";
import { IconCircle, IconProgress } from "@/components/Icons.tsx";

export interface IIconLoading extends ComponentProps<"article"> {
	size?: string;
}

export function IconLoading({ size = "size-5", className }: IIconLoading) {
	className = classNames("relative", className, size);

	return (
		<article className={className}>
			<BaseIcon
				as={IconCircle}
				className="fill-sky-400"
				size="size-full"
			/>
			<BaseIcon
				as={IconProgress}
				className="absolute top-0 animate-spin fill-sky-900"
				size="size-full"
			/>
		</article>
	);
}
