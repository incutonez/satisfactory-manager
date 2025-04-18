import { Cell } from "@tanstack/react-table";
import { getInventoryItem } from "@/api/inventory.ts";
import { machines } from "@/api/machines.ts";
import { IconArrowForward } from "@/components/Icons.tsx";
import { useAppSelector } from "@/store.ts";
import { IInventoryItem, IInventoryRecipe, TItemKey } from "@/types.ts";

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
	const record = useAppSelector(getInventoryItem(itemId));
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

export function RecipeMachine({ record }: { record?: IInventoryRecipe }) {
	if (!record) {
		return;
	}
	const [machineId] = record.producedIn;
	const found = machines.find((machine) => machine.id === machineId);
	if (!found) {
		return;
	}
	return (
		<>
			<IconArrowForward className="size-10" />
			<img
				className="size-32"
				alt={found.name}
				title={found.name}
				src={found.image}
			/>
			<IconArrowForward className="size-10" />
		</>
	);
}
