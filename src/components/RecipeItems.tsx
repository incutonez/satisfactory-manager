import classNames from "classnames";
import { getStateInventoryItem } from "@/api/inventory.ts";
import { ItemImage } from "@/components/CellItem.tsx";
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

// TODOJEF: Use somersloop value
export function RecipeItems({ items = [], overclock, somersloop, recipeType, highlightItem, machineCount }: IRecipeItems) {
	overclock /= 100;
	const itemNodes = items.map((item) => {
		if (item.recipeType !== recipeType) {
			return;
		}
		const { itemId } = item;
		const inventoryItem = getStateInventoryItem(itemId);
		if (!inventoryItem) {
			return;
		}
		const amount = item.amountPerMinute * overclock * machineCount;
		const cls = classNames("rounded-md", highlightItem === itemId ? "bg-yellow-200" : "");
		return (
			<tr
				key={`${item.recipeType}_${itemId}`}
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
	});
	return (
		<table className="table-fixed">
			<tbody>
				{itemNodes}
			</tbody>
		</table>
	);
}
