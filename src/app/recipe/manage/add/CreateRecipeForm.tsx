'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { createRecipe } from '@/app/recipe/actions';
import { useRouter } from 'next/navigation';
import { Ingredient, Recipe } from '@/types';
import { CreateRecipeIngredientsForm } from './CreateRecipeIngredientsForm';

export default function CreateRecipeForm() {
    const router = useRouter();

    const [recipeData, setRecipeData] = useState<Recipe>({
        name: '',
        slug: '',
        description: '',
    });
    const [recipeIngredientsData, setRecipeIngredientsData] = useState<
        Ingredient[]
    >([]);

    const handleChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const name = event.target.name;
        const value = event.target.value;

        if (name === 'name') {
            const urlFriendlySlug = value
                .normalize('NFKD') // split accented characters into their base characters and diacritical marks
                .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
                .trim() // trim leading or trailing whitespace
                .toLowerCase() // convert to lowercase
                .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
                .replace(/\s+/g, '-') // replace spaces with hyphens
                .replace(/-+/g, '-'); // remove consecutive hyphens

            setRecipeData({
                ...recipeData,
                slug: urlFriendlySlug,
            });
        }

        setRecipeData((values) => ({
            ...values, 
            [name]: value 
        }));
    };

    const handleSubmit = async (
        event: FormEvent<EventTarget | HTMLFormElement>
    ) => {
        event.preventDefault();

        await createRecipe(recipeData, recipeIngredientsData);

        router.push('/recipe/manage');
        router.refresh();
    };

    const handleRecipeIngredients = (recipeIngredientsData: Ingredient[]) => {
        setRecipeIngredientsData([...recipeIngredientsData]);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col max-w-[600px] mt-4"
        >
            <label htmlFor="name" className="mb-1">
                Recept naam
            </label>
            <input
                type="text"
                name="name"
                id="name"
                className="mb-4 p-2 bg-white autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)] form-select"
                onChange={handleChange}
                autoComplete="off"
            />
            <label htmlFor="slug" className="mb-1">
                Slug
            </label>
            <input
                type="text"
                name="slug"
                id="slug"
                value={recipeData.slug}
                onChange={handleChange}
                className="mb-4 p-2 autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)]"
                disabled
            />
            <label htmlFor="description" className="mb-1">
                Omschrijving
            </label>
            <textarea
                name="description"
                id="description"
                className="h-[200px] mb-6 p-2 bg-white autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)]"
                onChange={handleChange}
            ></textarea>
            <h4 className="mb-2 font-bold">Ingredienten</h4>
            <CreateRecipeIngredientsForm
                recipeIngredientsData={handleRecipeIngredients}
            />
            <div>
                <button
                    type="submit"
                    className="mr-4 p-2 text-center bg-[#955961] text-white disabled:bg-[#e5e5e5] disabled:text-[#acacac] disabled:cursor-wait"
                >
                    Toevoegen
                </button>
                <button
                    type="button"
                    className="p-2"
                    onClick={() => router.push('/recipe/manage')}
                >
                    Annuleren
                </button>
            </div>
        </form>
    );
}
