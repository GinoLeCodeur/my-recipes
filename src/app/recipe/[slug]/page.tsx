import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getRecipeBySlug, getRecipeIngredients, getRecipeSteps } from '../actions';
import { RecipeIngredients } from './RecipeIngredients';

export default async function Page({
    params: { slug },
}: {
    params: { slug: string };
}) {
    const { rows: recipeData } = await getRecipeBySlug(slug);

    if (!recipeData.length) {
        notFound();
    }
    
    const { rows: ingredientsData } = await getRecipeIngredients(
        recipeData[0].recipeId as number
    );

    const { rows: recipeStepsData } = await getRecipeSteps(
        recipeData[0].recipeId as number
    );

    return (
        <article>
            <header className="mb-4">
                <picture>
                    <Image
                        src={`${
                            recipeData[0].image ||
                            '/my-recipes-image-placeholder.jpg'
                        }`}
                        alt={recipeData[0].name}
                        width="600"
                        height="400"
                        className="w-full h-[300px] object-cover"
                    />
                </picture>
            </header>
            <div className="flex items-start gap-4">
                <main className="flex-1">
                    <h1 className="text-4xl font-medium">
                        {recipeData[0].name}
                    </h1>
                    {recipeData[0].description &&
                        recipeData[0].description.length > 0 && (
                            <p>{recipeData[0].description}</p>
                        )}
                    <h3 className="mt-4 font-bold">Stappen:</h3>
                    <div className="flex flex-col gap-2">
                        {recipeStepsData.length ? (
                            recipeStepsData.map((step) => (
                                <p key={step.recipeStepId}>
                                    {step.description}
                                </p>
                            ))
                        ) : (
                            <p>Geen stappen gevonden</p>
                        )}
                    </div>
                </main>
                <aside className="sticky top-[0] w-[300px]">
                    <RecipeIngredients
                        recipeData={recipeData[0]}
                        recipeIngredientsData={ingredientsData}
                    />
                </aside>
            </div>
        </article>
    );
}
