import { ComponentProps, ReactNode } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import { BaseButton } from "@/components/BaseButton.tsx";
import { IconCancel, IconClose } from "@/components/Icons.tsx";

export interface IBaseDialog extends ComponentProps<"dialog"> {
	titleSlot?: ReactNode;
	footerSlot?: ReactNode;
	bodyCls?: string;
	footerCls?: string;
	title?: string;
	size?: string;
	closable?: boolean;
	show: boolean | undefined;
	setShow: (show: boolean) => void;
}

export function BaseDialog({ children, bodyCls, footerCls, title, show, setShow, titleSlot, className, size = "size-5/6", closable = true, footerSlot }: IBaseDialog) {
	/* This fixes an autoFocus bug if an input is in a base dialog... it's not ideal because the dialog re-renders every
	 * time it's hidden, and then shown again, but that's OK for now */
	if (!show) {
		return;
	}
	const dialogCls = classNames("z-1 flex shadow-md border rounded border-gray-300 flex-col absolute left-0 right-0 top-0 bottom-0 m-auto bg-white", className, size);
	let titleCloseNode: ReactNode;
	let cancelButtonNode: ReactNode;
	bodyCls = classNames("flex-1 overflow-auto p-2", bodyCls);
	footerCls = classNames("flex space-x-2 justify-end border-t border-slate-400 p-2", footerCls);
	titleSlot ??= (
		<h1 className="font-bold">
			{title}
		</h1>
	);

	if (closable) {
		titleCloseNode = (
			<BaseButton
				icon={IconClose}
				onClick={onClickCancel}
			/>
		);
		cancelButtonNode = (
			<BaseButton
				text="Cancel"
				icon={IconCancel}
				onClick={onClickCancel}
			/>
		);
	}

	function onClickCancel() {
		setShow(false);
	}

	const content = (
		<dialog
			className={dialogCls}
			open={show}
		>
			<header className="flex items-center justify-between border-b border-slate-400 bg-slate-200 p-2">
				{titleSlot}
				{titleCloseNode}
			</header>
			<section className={bodyCls}>
				{children}
			</section>
			<footer className={footerCls}>
				{footerSlot}
				{cancelButtonNode}
			</footer>
		</dialog>
	);
	return createPortal(content, document.body);
}
