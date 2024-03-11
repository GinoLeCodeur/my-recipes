import { getRecipeBySlug, getRecipeIngredients } from "@/app/recipe/actions";
import { RecipeForm } from "../../RecipeForm";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { slug: string } }) {
    const { rows: recipeData } = await getRecipeBySlug(params.slug);

    if (!recipeData.length) {
        notFound();
    }

    const { rows: recipeIngredientsData } = await getRecipeIngredients(
        recipeData[0].recipeId as number
    );

    return (
        <>
            <h1 className="flex-1 text-4xl font-medium">Recept bewerken</h1>
            <RecipeForm
                recipeData={recipeData[0]}
                recipeIngredientsData={recipeIngredientsData}
            />
        </>
    );
}