import { Cell } from "@tanstack/react-table";
import { getInventoryItem } from "@/api/inventory.ts";
import { machines } from "@/api/machines.ts";
import { IconArrowForward } from "@/components/Icons.tsx";
import { useAppSelector } from "@/store.ts";
import { IInventoryItem, TItemKey } from "@/types.ts";

interface IItemName {
	cell: Cell<IInventoryItem, unknown>;
}

export function ItemName({ cell }: IItemName) {
	return (
		<article className="flex space-x-2">
			<ItemImage itemId={cell.row.original.id} />
			<span>
				{cell.getValue() as string}
			</span>
		</article>
	);
}

export function ItemImage({ itemId }: { itemId: TItemKey }) {
	const record = useAppSelector((state) => getInventoryItem(state, itemId));
	if (!record) {
		return;
	}
	return (
		<img
			className="size-6"
			alt={record.name}
			src={record.image}
		/>
	);
}

export function RecipeMachine({ machineId, showLeftArrow = true, showRightArrow = true, arrowSize = "size-10", size = "size-32" }: { machineId?: string, arrowSize?: string, showLeftArrow?: boolean, showRightArrow?: boolean, size?: string }) {
	if (!machineId) {
		return;
	}

	let leftArrowNode;
	let rightArrowNode;
	const found = machines.find((machine) => machine.id === machineId);

	if (!found) {
		return;
	}

	if (showLeftArrow) {
		leftArrowNode = (
			<IconArrowForward className={arrowSize} />
		);
	}

	if (showRightArrow) {
		rightArrowNode = (
			<IconArrowForward className={arrowSize} />
		);
	}

	return (
		<>
			{leftArrowNode}
			<img
				className={size}
				alt={found.name}
				title={found.name}
				src={found.image}
			/>
			{rightArrowNode}
		</>
	);
}
