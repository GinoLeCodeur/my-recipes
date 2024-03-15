import { getRecipeBySlug, getRecipeIngredients, getRecipeSteps } from "@/app/recipe/actions";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { getServerSession } from 'next-auth/next';
import { RecipeForm } from "../../RecipeForm";
import { notFound } from "next/navigation";
import { UserRole } from "@/types";

export default async function Page({ params }: { params: { slug: string } }) {
    const session = await getServerSession(authOptions);

    const { rows: recipeData } = await getRecipeBySlug(params.slug);

    if (!recipeData.length) {
        notFound();
    }

    if (session?.user.userId !== recipeData[0].createdBy && session?.user.role !== UserRole.ADMIN) {
        return (
            <>
                <h1 className="flex-1 text-4xl font-medium">Recept bewerken</h1>
                <p>U heeft geen rechten om dit recept te bewerken.</p>
            </>
        );
    }

    const { rows: recipeIngredientsData } = await getRecipeIngredients(
        recipeData[0].recipeId as number
    );

    const { rows: recipeStepsData } = await getRecipeSteps(
        recipeData[0].recipeId as number
    );

    return (
        <>
            <h1 className="flex-1 text-4xl font-medium">Recept bewerken</h1>
            <RecipeForm
                recipeData={recipeData[0]}
                recipeIngredientsData={recipeIngredientsData}
                recipeStepsData={recipeStepsData}
            />
        </>
    );
}