'use client';

import { Recipe } from "@/types";
import { useRouter } from 'next/navigation';
import { deleteRecipe } from "../actions";

export const RemoveRecipeButton = ({recipe}: {recipe:Recipe}) => {
    const router = useRouter();

    async function removeRecipe() {
        const recipeId = recipe?.recipeId ? recipe.recipeId : 0;

        const confirmDelete = confirm(
            `Weet u zeker dat u recept "${recipe.name}" wilt verwijderen?`
        );

        if (confirmDelete) {
            await deleteRecipe(recipeId);
            router.refresh();
        }
    };

    return (
        <button type="button" className="flex items-center" onClick={() => removeRecipe()}>
            <span className="block material-symbols-outlined mr-1 -mb-[1px]">
                delete
            </span>
            Verwijderen
        </button>
    );
};