import classNames from "classnames";
import { getInventoryItem } from "@/api/inventory.ts";
import { ItemImage } from "@/components/CellItem.tsx";
import { useAppSelector } from "@/store.ts";
import { IRecipeItem, TItemKey, TRecipeType } from "@/types.ts";
import { pluralize } from "@/utils/common.ts";

export interface IRecipeItems {
	items?: IRecipeItem[];
	highlightItem?: TItemKey;
	recipeType?: TRecipeType;
	overclock: number;
	somersloop: number;
	machineCount: number;
}

export interface RecipeItemComponent {
	item: IRecipeItem;
	highlightItem?: TItemKey;
	overclock: number;
	somersloop: number;
	machineCount: number;
}

export function RecipeItems({ items = [], overclock, recipeType, highlightItem, somersloop, machineCount }: IRecipeItems) {
	overclock /= 100;
	const itemNodes = items.map((item) => {
		if (item.recipeType !== recipeType) {
			return;
		}
		return (
			<RecipeItem
				key={`${item.recipeType}_${item.itemId}`}
				item={item}
				highlightItem={highlightItem}
				overclock={overclock}
				somersloop={somersloop}
				machineCount={machineCount}
			/>
		);
	});
	return (
		<table className="table-fixed">
			<tbody>
				{itemNodes}
			</tbody>
		</table>
	);
}

// TODOJEF: Use somersloop value
export function RecipeItem({ item, overclock, machineCount, highlightItem }: RecipeItemComponent) {
	const { itemId } = item;
	const inventoryItem = useAppSelector((state) => getInventoryItem(state, itemId));
	if (!inventoryItem) {
		return;
	}
	const amount = item.amountPerMinute * overclock * machineCount;
	const cls = classNames("rounded-md", highlightItem === itemId ? "bg-yellow-200" : "");
	return (
		<tr
			className={cls}
			title={inventoryItem.name}
		>
			<td className="text-right px-1 py-0.5">
				{amount}
			</td>
			<td className="px-1 flex space-x-1 py-0.5">
				<ItemImage itemId={itemId} />
				<span>
					{pluralize(inventoryItem.name, amount)}
				</span>
			</td>
			<td className="px-1 py-0.5">/</td>
			<td className="px-1 py-0.5">minute</td>
		</tr>
	);
}
