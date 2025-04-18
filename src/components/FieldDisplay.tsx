import { ComponentProps } from "react";
import { FieldLabel } from "@/components/FieldLabel.tsx";

export interface IFieldDisplay extends ComponentProps<"article"> {
	label?: string;
	value?: string | number;
	labelPosition?: "top" | "left";
	labelCls?: string;
}

export function FieldDisplay({ label, labelCls, value = "", labelPosition = "left" }: IFieldDisplay) {
	const cls = ["h-8 flex items-center"];
	if (labelPosition === "top") {
		cls.push("flex-col");
	}
	else {
		cls.push("space-x-1");
	}
	return (
		<article className={cls.join(" ")}>
			<FieldLabel
				text={label}
				className={labelCls}
			/>
			<span className="text-sm font-semibold">
				{value}
			</span>
		</article>
	);
}
