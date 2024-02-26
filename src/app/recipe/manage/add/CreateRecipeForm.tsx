'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { createRecipe } from '@/app/recipe/actions';
import { useRouter } from 'next/navigation';
import { Recipe } from '@/types';

export default function CreateRecipeForm() {
    const router = useRouter();

    const [recipeData, setRecipeData] = useState<Recipe>({
        name: '',
        slug: '',
        description: ''
    });
    
    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const name = event.target.name;
        const value = event.target.value;

        setRecipeData((values) => ({ ...values, [name]: value }));
    };

    const handleSubmit = async (event: FormEvent<EventTarget | HTMLFormElement>) => {
        event.preventDefault();

        console.log(recipeData);

        await createRecipe({
            name: recipeData.name,
            slug: recipeData.slug,
            description: recipeData.description,
        });

        router.push('/recipe/manage');
        router.refresh();
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col max-w-[600px] mt-4"
        >
            <label htmlFor="name" className="mb-2">
                Recept naam
            </label>
            <input
                type="text"
                name="name"
                id="name"
                className="mb-4 p-2 bg-white autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)]"
                onChange={handleChange}
            />
            <label htmlFor="slug" className="mb-2">
                Slug
            </label>
            <input
                type="text"
                name="slug"
                id="slug"
                className="mb-4 p-2 bg-white autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)]"
                onChange={handleChange}
            />
            <label htmlFor="description" className="mb-2">
                Omschrijving
            </label>
            <textarea
                name="description"
                id="description"
                className="h-[200px] mb-4 p-2 bg-white autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)]"
                onChange={handleChange}
            ></textarea>
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
