'use server';

import { Ingredient, Recipe, RecipeStep } from '@/types';
import { sql } from '@vercel/postgres';
import { authOptions } from '../api/auth/[...nextauth]/authOptions';
import { getServerSession } from 'next-auth/next';

export async function getRecipes() {
    try {
        return await sql<Recipe>`
			SELECT 
				recipe_id as "recipeId",
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

export async function getRecipe(slug: string) {
    try {
        return await sql<Recipe>`
			SELECT 
				recipe_id as "recipeId",
				slug, 
				name, 
				description,
				image 
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

export async function createRecipe(
    recipe: Recipe,
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
				created_by
			) VALUES (
				${recipe.name},
				${recipe.slug},
				${recipe.description},
				${session.user.userId}
			)
			RETURNING recipe_id AS "recipeId";
		`;

        if (createRecipe.length > 0 && createRecipe[0].recipeId) {
            recipeIngredients?.map(async (ingredient) => {
				const { rows: createIngredientRes } = await createIngredient(ingredient);
				ingredient.ingredientId = createIngredientRes[0].ingredientId;

				await createRecipeIngredient(createRecipe[0].recipeId, ingredient);
            });
        }
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to create recipe.');
    }
}

export async function deleteRecipe(recipeId: number) {
    const session = await getServerSession(authOptions);

    if (!session) {
        console.error('Authentication error.');
        throw new Error('Not authorized.');
    }

    try {
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

export async function getIngredients() {
    try {
        return await sql<Ingredient>`
			SELECT 
				ingredient_id as "ingredientId",
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

export async function createRecipeIngredient(recipeId: number, ingredient: Ingredient) {
    try {
        await sql<Ingredient>`
			INSERT INTO recipe_ingredients (
				recipe_id,
				ingredient_id,
				quantity
			) VALUES (
				${recipeId},
				${ingredient.ingredientId},
				${ingredient.quantity}
			);
		`;
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to create recipe ingredient.');
    }
}