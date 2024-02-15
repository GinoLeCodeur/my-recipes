import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sql } from "@vercel/postgres";

export default async function Page({
    params: { slug },
}: {
    params: { slug: string };
}) {
    const { rows: recipesData } = await sql`
        SELECT 
            recipe_id AS "recipeId", 
            name, 
            slug, 
            description, 
            image
        FROM recipes
        WHERE slug = ${slug}
    `;

    if (!recipesData.length) {
        notFound();
    }

    const { rows: ingredientsData } = await sql`
        SELECT 
            ingredients.ingredient_id AS "ingredientId",
            name,
            quantity,
            unit,
            ingredient_order AS "ingredientOrder"
        FROM ingredients
            INNER JOIN recipes_ingredients
                ON recipes_ingredients.ingredient_id = ingredients.ingredient_id
        WHERE recipes_ingredients.recipe_id = ${recipesData[0].recipeId}
        ORDER BY
            ingredient_order ASC
    `;

    const { rows: recipeStepsData } = await sql`
        SELECT 
            recipe_step_id AS "recipeStepId",
            description
        FROM 
            recipe_steps
        WHERE recipe_id = ${recipesData[0].recipeId}
        ORDER BY
            step_order ASC
    `;

    return (
        <main className="flex-1 w-full max-w-screen-xl py-4">
            <article>
                <header className="mb-4">
                    <picture>
                        <Image
                            src="https://placehold.co/600x400?text=Hello+world"
                            alt={recipesData[0].name}
                            width="600"
                            height="400"
                            unoptimized
                            className="w-full h-[300px] object-cover"
                        />
                    </picture>
                </header>
                <div className="flex items-start gap-4">
                    <main className="flex-1">
                        <h1 className="text-4xl font-medium">
                            {recipesData[0].name}
                        </h1>
                        {recipesData[0].description.length > 0 &&
                            <p>{recipesData[0].description}</p>
                        }
                        <h3 className="mt-4 font-bold">Stappen:</h3>
                        {recipeStepsData.length ? (
                            recipeStepsData.map((step) => (
                                <p key={step.recipeStepId}>
                                    {step.description}
                                </p>
                            ))
                        ) : (
                            <p>Geen stappen gevonden</p>
                        )}
                    </main>
                    <aside className="sticky top-[0] w-[300px]">
                        <h4 className="font-bold">Ingrediënten</h4>
                        {ingredientsData.length ? (
                            <ol>
                                {ingredientsData.map((ingredient) => (
                                    <li key={ingredient.ingredientId}>
                                        {ingredient.name}
                                    </li>
                                ))}
                            </ol>
                        ) : (
                            <p>Geen ingrediënten gevonden</p>
                        )}
                    </aside>
                </div>
            </article>
        </main>
    );
}
