'use server';

import { Recipe } from '@/types';
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
			) AND slug = ${slug}
		`;
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to fetch recipe.');
    }
}

export async function createRecipe(recipe: Recipe) {
	const session = await getServerSession(authOptions);

	if (!session) {
        console.error('Authentication error.');
        throw new Error('Not authorized.');
	}

	console.log('User:', session.user);
	console.log('Recipe:', recipe);

    try {
        await sql`
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
			);
		`;
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
			WHERE recipe_id = ${recipeId}
		`;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to delete recipe.');
    }
}
