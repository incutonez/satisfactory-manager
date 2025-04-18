import defaultRecipes from "@/api/recipes.json";
import { IRecipe } from "@/types.ts";

export const recipes = defaultRecipes as IRecipe[];

recipes.sort((lhs, rhs) => lhs.name.localeCompare(rhs.name));
