import classNames from "classnames";
import { getActiveItemRecipe } from "@/api/activeItem.ts";
import { getInventoryItem } from "@/api/inventory.ts";
import { BaseButton } from "@/components/BaseButton.tsx";
import { IconCheckCircle, IconError } from "@/components/Icons.tsx";
import { TooltipContext } from "@/components/TooltipContext.tsx";
import { useAppSelector } from "@/store.ts";
import { IRecipeItem, TItemKey, TRecipeType } from "@/types.ts";
import { pluralize } from "@/utils/common.ts";
import { ItemImage } from "@/views/shared/CellItem.tsx";

export interface IRecipeItems {
	items?: IRecipeItem[];
	recipeId?: string;
	highlightItem?: TItemKey;
	recipeType: TRecipeType;
	multiplier: number;
}

export interface RecipeItemComponent {
	item: IRecipeItem;
	recipeId?: string;
	highlightItem?: TItemKey;
	multiplier: number;
}

export function RecipeItems({ items = [], recipeId, recipeType, highlightItem, multiplier }: IRecipeItems) {
	const itemNodes = items.map((item) => {
		if (item.recipeType !== recipeType) {
			return;
		}
		return (
			<RecipeItem
				key={`${item.recipeType}_${item.itemId}`}
				recipeId={recipeId}
				item={item}
				highlightItem={highlightItem}
				multiplier={multiplier}
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

export function RecipeItem({ item, recipeId, multiplier, highlightItem }: RecipeItemComponent) {
	const { itemId, amountPerMinute, recipeType } = item;
	const inventoryItem = useAppSelector((state) => getInventoryItem(state, itemId));
	const activeItemRecipe = useAppSelector((state) => getActiveItemRecipe(state, recipeId));
	if (!inventoryItem) {
		return;
	}
	const amountPerMinuteDisplay = activeItemRecipe?.items.find((itemRecord) => itemRecord.recipeType === recipeType && itemRecord.itemId === itemId)?.amountPerMinuteDisplay ?? 0;
	const amount = amountPerMinute * multiplier;
	const cls = classNames("rounded-md", highlightItem === itemId ? "bg-yellow-200" : "");
	let { consumingTotal, producingTotal } = inventoryItem;
	let total = 0;
	// We have to remove the initial values from the totals, so we can show how much the recipe uses/gains
	if (recipeType === "consumes") {
		total = -amount;
		consumingTotal -= amountPerMinuteDisplay;
	}
	else if (recipeType === "produces") {
		total = amount;
		producingTotal -= amountPerMinuteDisplay;
	}
	total += producingTotal - consumingTotal;
	let totalCls = "bg-zero";
	let buttonCls = "fill-zero-100";
	const totalIcon = total < 0 ? IconError : IconCheckCircle;
	if (total < 0) {
		totalCls = "bg-negative";
		buttonCls = "fill-negative-100";
	}
	else if (total > 0) {
		totalCls = "bg-positive";
		buttonCls = "fill-positive-100";
	}
	buttonCls = `${buttonCls} hover:bg-sky-100`;
	const buttonConfig = (
		<BaseButton
			plain={true}
			className={buttonCls}
			icon={totalIcon}
		/>
	);

	return (
		<tr className={cls}>
			<td className="text-right px-1 h-8">
				{amount}
			</td>
			<td className="px-1 flex items-center space-x-1 h-8">
				<ItemImage itemId={itemId} />
				<span>
					{pluralize(inventoryItem.name, amount)}
				</span>
			</td>
			<td className="px-1 h-8">/</td>
			<td className="px-1 h-8">minute</td>
			<td className="h-8">
				<TooltipContext buttonConfig={buttonConfig}>
					<article>
						<table className="border-spacing-0 border-separate">
							<tbody>
								<tr>
									<td className="min-w-28 text-right py-1 px-2">Producing:</td>
									<td className="py-1 px-2 text-right">
										{producingTotal ? "+" : ""}
										{producingTotal}
									</td>
								</tr>
								<tr>
									<td className="min-w-28 text-right py-1 px-2">Consuming:</td>
									<td className="py-1 px-2 text-right">
										{consumingTotal ? "-" : ""}
										{consumingTotal}
									</td>
								</tr>
								<tr>
									<td className="min-w-28 text-right py-1 px-2">Recipe:</td>
									<td className="py-1 px-2 text-right">
										{recipeType === "produces" ? "+" : "-"}
										{amount}
									</td>
								</tr>
								<tr className={totalCls}>
									<td className="min-w-28 text-right border-t py-1 px-2">Total:</td>
									<td className="py-1 px-2 text-right border-t">
										{total > 0 ? "+" : ""}
										{total}
									</td>
								</tr>
							</tbody>
						</table>
					</article>
				</TooltipContext>
			</td>
		</tr>
	);
}
