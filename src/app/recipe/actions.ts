'use server';

import { Ingredient, Recipe, RecipeStep, UserRole } from '@/types';
import { sql } from '@vercel/postgres';
import { authOptions } from '../api/auth/[...nextauth]/authOptions';
import { getServerSession } from 'next-auth/next';
import { del, put } from '@vercel/blob';

export async function getRecipes() {
    try {
        return await sql<Recipe>`
			SELECT 
				recipe_id AS "recipeId",
				slug, 
				name, 
				description,
				image 
			FROM recipes
			WHERE inactive >= to_timestamp(${Date.now()} / 1000.0)
				OR inactive IS NULL
			ORDER BY recipe_id DESC;
		`;
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to fetch recipes.');
    }
}

export async function getRecipesByUser() {
    const session = await getServerSession(authOptions);

    if (!session) {
        console.error('Authentication error.');
        throw new Error('Not authorized.');
    }

    try {
        return await sql<Recipe>`
			SELECT 
				recipe_id AS "recipeId",
				slug, 
				name, 
				description,
				image,
                persons
			FROM recipes
			WHERE (
                inactive >= to_timestamp(${Date.now()} / 1000.0)
				OR inactive IS NULL
            ) AND created_by = ${session.user.userId}
			ORDER BY recipe_id DESC;
		`;
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to fetch recipes.');
    }
}

export async function getRecipeBySlug(slug: string) {
    try {
        return await sql<Recipe>`
			SELECT 
				recipe_id AS "recipeId",
				slug, 
				name, 
				description,
				image,
                persons,
                created_by AS "createdBy"
			FROM recipes
			WHERE (
				inactive >= to_timestamp(${Date.now()} / 1000.0)
				OR inactive IS NULL
			) AND slug = ${slug};
		`;
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to fetch recipe.');
    }
}

export async function getRecipeById(recipeId: number) {
    try {
        return await sql<Recipe>`
			SELECT 
				recipe_id AS "recipeId",
				slug, 
				name, 
				description,
				image,
                created_by AS "createdBy"
			FROM recipes
			WHERE (
				inactive >= to_timestamp(${Date.now()} / 1000.0)
				OR inactive IS NULL
			) AND recipe_id = ${recipeId};
		`;
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to fetch recipe.');
    }
}

export async function createRecipe(
    recipe: Recipe,
    recipeImage: FormData | null,
    recipeIngredients?: Ingredient[],
    recipeSteps?: RecipeStep[]
) {
    const session = await getServerSession(authOptions);

    if (!session) {
        console.error('Authentication error.');
        throw new Error('Not authorized.');
    }

    try {
        const { rows: createRecipe } = await sql`
			INSERT INTO recipes (
				name,
				slug,
				description,
                persons,
				created_by
			) VALUES (
				${recipe.name},
				${recipe.slug},
				${recipe.description},
				${recipe.persons},
				${session.user.userId}
			)
			RETURNING recipe_id AS "recipeId";
		`;

        if (createRecipe.length > 0 && createRecipe[0].recipeId) {
            if (
                recipeImage &&
                recipeImage.get('recipeImage') &&
                recipeImage.get('recipeImage') !== 'null'
            ) {
                await createRecipeImage(
                    null,
                    {...recipe, recipeId: createRecipe[0].recipeId},
                    recipeImage.get('recipeImage') as File
                );
            }

            recipeIngredients?.map(async (ingredient, index) => {
                const { rows: createIngredientRes } = await createIngredient(
                    ingredient
                );
                ingredient.ingredientId = createIngredientRes[0].ingredientId;

                await createRecipeIngredient(
                    createRecipe[0].recipeId,
                    ingredient,
                    index
                );
            });
            
            recipeSteps?.map(async (step, index) => {
                await createRecipeStep(
                    createRecipe[0].recipeId,
                    step,
                    index
                );
            });
        }
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to create recipe.');
    }
}

export async function updateRecipe(
    recipe: Recipe,
    recipeImage: FormData | null,
    recipeIngredients?: Ingredient[],
    recipeSteps?: RecipeStep[]
) {
    const session = await getServerSession(authOptions);
    const { rows: checkUserRecipe } = await getRecipeById(
        recipe.recipeId as number
    );

    if (
        session?.user.userId !== checkUserRecipe[0].createdBy &&
        session?.user.role !== UserRole.ADMIN
    ) {
        console.error('Authorization error.');
        throw new Error('Not authorized.');
    }

    try {
        const { rows: updateRecipe } = await sql`
			UPDATE recipes
            SET
                name = ${recipe.name},
                slug = ${recipe.slug},
                description = ${recipe.description},
                persons = ${recipe.persons}
            WHERE
                recipe_id = ${recipe.recipeId}
			RETURNING recipe_id AS "recipeId";
		`;

        await deleteRecipeIngredients(updateRecipe[0].recipeId);
        await deleteRecipeStep(updateRecipe[0].recipeId);

        if (updateRecipe.length > 0 && updateRecipe[0].recipeId) {
            if (checkUserRecipe[0].image && !recipe.image) {
                await deleteRecipeImage(checkUserRecipe[0]);
            }
            if (
                recipeImage &&
                (
                    recipeImage.get('recipeImage') &&
                    recipeImage.get('recipeImage') !== 'null'
                )
            ) {
                await createRecipeImage(
                    checkUserRecipe[0],
                    recipe,
                    recipeImage.get('recipeImage') as File
                );
            }

            recipeIngredients?.map(async (ingredient, index) => {
                const { rows: createIngredientRes } = await createIngredient(
                    ingredient
                );
                ingredient.ingredientId = createIngredientRes[0].ingredientId;

                await createRecipeIngredient(
                    updateRecipe[0].recipeId,
                    ingredient,
                    index
                );
            });

            recipeSteps?.map(async (step, index) => {
                await createRecipeStep(
                    updateRecipe[0].recipeId,
                    step,
                    index
                );
            });
        }
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to update recipe.');
    }
}

export async function deleteRecipe(recipeId: number) {
    const session = await getServerSession(authOptions);

    const { rows: checkUserRecipe } = await getRecipeById(recipeId);

    if (
        session?.user.userId !== checkUserRecipe[0].createdBy &&
        session?.user.role !== UserRole.ADMIN
    ) {
        console.error('Authorization error.');
        throw new Error('Not authorized.');
    }

    try {
        await deleteRecipeImage(checkUserRecipe[0]);
        
        await sql`
			UPDATE recipes
			SET inactive = to_timestamp(${Date.now()} / 1000.0)
			WHERE recipe_id = ${recipeId};
		`;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to delete recipe.');
    }
}

async function createRecipeImage(previousRecipe: Recipe | null, recipe: Recipe, recipeImage: File) {
    if (previousRecipe && previousRecipe.image) {
        await deleteRecipeImage(previousRecipe as Recipe);
    }

    try {
        const fileExtension = recipeImage.name.slice(recipeImage.name.lastIndexOf('.'));
        const fileName = `${recipe.recipeId}-${recipe.slug}.${fileExtension}`;
        
        const file = await put(
            `recipe_images/${fileName}`,
            recipeImage,
            {
                access: 'public',
            }
        );

        await sql`
			UPDATE recipes
            SET
                image = ${file.url}
            WHERE
                recipe_id = ${recipe.recipeId}
		`;
    } catch (error) {
        throw new Error('Failed to create recipe image.');
    }
}

async function deleteRecipeImage(previousRecipe: Recipe) {
    try {
        await del(previousRecipe.image as string);

        await sql`
    		UPDATE recipes
            SET
                image = null
            WHERE
                recipe_id = ${previousRecipe.recipeId}
    	`;
    } catch (error) {
        throw new Error('Failed to delete recipe image.');
    }
}

export async function getIngredients() {
    try {
        return await sql<Ingredient>`
			SELECT 
				ingredient_id AS "ingredientId",
				name,
				unit
			FROM ingredients;
		`;
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to fetch ingredients.');
    }
}

export async function createIngredient(ingredient: Ingredient) {
    const session = await getServerSession(authOptions);

    if (!session) {
        console.error('Authentication error.');
        throw new Error('Not authorized.');
    }

    try {
        return await sql<Ingredient>`
			WITH t AS
			(
				INSERT INTO ingredients (
					name,
					unit
				) VALUES (
					${ingredient.name},
					${ingredient.unit}
				)
				ON CONFLICT (name) DO NOTHING
				RETURNING ingredient_id
			)
			SELECT ingredient_id AS "ingredientId"
			FROM t
			UNION ALL
			SELECT ingredient_id AS "ingredientId"
			FROM ingredients 
			WHERE name = ${ingredient.name}
			LIMIT 1;
		`;
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to create ingredient.');
    }
}

export async function getRecipeIngredients(recipeId: number) {
    try {
        return await sql<Ingredient>`
			SELECT 
				ingredients.ingredient_id AS "ingredientId",
				name,
				quantity,
				unit
			FROM recipe_ingredients
			INNER JOIN ingredients
				ON ingredients.ingredient_id = recipe_ingredients.ingredient_id
			WHERE recipe_id = ${recipeId}
            ORDER BY ingredient_order ASC;
		`;
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to fetch recipe ingredients.');
    }
}

export async function createRecipeIngredient(
    recipeId: number,
    ingredient: Ingredient,
    orderIndex: number
) {
    const session = await getServerSession(authOptions);

    if (!session) {
        console.error('Authentication error.');
        throw new Error('Not authorized.');
    }

    try {
        await sql`
			INSERT INTO recipe_ingredients (
				recipe_id,
				ingredient_id,
				quantity,
                ingredient_order
			) VALUES (
				${recipeId},
				${ingredient.ingredientId},
				${ingredient.quantity},
                ${orderIndex}
			);
		`;
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to create recipe ingredient.');
    }
}

export async function deleteRecipeIngredients(recipeId: number) {
    const session = await getServerSession(authOptions);

    if (!session) {
        console.error('Authentication error.');
        throw new Error('Not authorized.');
    }

    try {
        await sql`
			DELETE FROM recipe_ingredients
			WHERE recipe_id = ${recipeId};
		`;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to delete recipe ingredients.');
    }
}

export async function getRecipeSteps(recipeId: number) {
    try {
        return await sql<RecipeStep>`
            SELECT 
                recipe_step_id AS "recipeStepId",
                description,
                step_order AS "order"
            FROM 
                recipe_steps
            WHERE recipe_id = ${recipeId}
            ORDER BY step_order ASC
		`;
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to fetch recipe steps.');
    }
}

export async function createRecipeStep(recipeId: number, step: RecipeStep, orderIndex: number) {
    const session = await getServerSession(authOptions);

    if (!session) {
        console.error('Authentication error.');
        throw new Error('Not authorized.');
    }

    try {
        await sql`
			INSERT INTO recipe_steps (
				recipe_id,
				description,
                step_order
			) VALUES (
				${recipeId},
				${step.description},
				${orderIndex}
			);
		`;
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to create recipe step.');
    }
}

export async function deleteRecipeStep(recipeId: number) {
    const session = await getServerSession(authOptions);

    if (!session) {
        console.error('Authentication error.');
        throw new Error('Not authorized.');
    }

    try {
        await sql`
			DELETE FROM recipe_steps
			WHERE recipe_id = ${recipeId};
		`;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to delete recipe step.');
    }
}