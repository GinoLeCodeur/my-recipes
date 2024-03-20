'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { createRecipe, updateRecipe } from '@/app/recipe/actions';
import { usePathname, useRouter } from 'next/navigation';
import { Ingredient, Recipe, RecipeStep } from '@/types';
import { RecipeIngredientsForm } from './RecipeIngredientsForm';
import { RecipeStepsForm } from './RecipeStepsForm';
import { RecipePersonsForm } from './RecipePersonsForm';

export const RecipeForm = ({
    recipeData,
    recipeIngredientsData,
    recipeStepsData,
}: {
    recipeData?: Recipe;
    recipeIngredientsData?: Ingredient[];
    recipeStepsData?: RecipeStep[];
}) => {
    const router = useRouter();
    const pathname = usePathname();

    const [recipe, setRecipe] = useState<Recipe>({
        name: '',
        slug: '',
        description: '',
        persons: 0
    });
    const [recipeIngredients, setRecipeIngredients] = useState<Ingredient[]>(
        []
    );
    const [recipeSteps, setRecipeSteps] = useState<RecipeStep[]>([]);

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

            setRecipe({
                ...recipe,
                slug: urlFriendlySlug,
            });
        }

        setRecipe((values) => ({
            ...values,
            [name]: value,
        }));
    };

    const handleSubmit = async (
        event: FormEvent<EventTarget | HTMLFormElement>
    ) => {
        event.preventDefault();
        
        if (pathname.startsWith('/recipe/manage/edit')) {
            await updateRecipe(recipe, recipeIngredients, recipeSteps);
        }
        if (pathname.startsWith('/recipe/manage/add')) {
            await createRecipe(recipe, recipeIngredients, recipeSteps);
        }

        router.push('/recipe/manage');
        router.refresh();
    };

    const handleRecipePersons = (recipePersonsData: number) => {
        setRecipe({
            ...recipe,
            persons: recipePersonsData
        });
    };

    const handleRecipeIngredients = (recipeIngredientsData: Ingredient[]) => {
        setRecipeIngredients([...recipeIngredientsData]);
    };

    const handleRecipeSteps = (recipeStepsData: RecipeStep[]) => {
        setRecipeSteps([...recipeStepsData]);
    };

    useEffect(() => {
        if (recipeData?.name && recipeData.name.length > 0) {
            setRecipe({ ...recipeData });
        }
    }, [recipeData]);

    useEffect(() => {
        if (recipeIngredientsData && recipeIngredientsData.length > 0) {
            setRecipeIngredients([...recipeIngredientsData]);
        }
    }, [recipeIngredientsData]);

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
                value={recipe.name}
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
                value={recipe.slug}
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
                value={recipe.description}
                className="h-[200px] mb-4 p-2 bg-white autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)]"
                onChange={handleChange}
            />
            <div className="mb-6">
                <h4 className="mb-2 font-bold">Ingrediënten</h4>
                <RecipePersonsForm
                    recipePersonsData={recipe.persons}
                    handleRecipePersons={handleRecipePersons}
                />
                <RecipeIngredientsForm
                    recipeIngredientsData={recipeIngredientsData}
                    handleRecipeIngredients={handleRecipeIngredients}
                />
            </div>
            <RecipeStepsForm
                recipeStepsData={recipeStepsData}
                handleRecipeSteps={handleRecipeSteps}
            />
            <div>
                <button
                    type="submit"
                    className="mr-4 p-2 text-center bg-[#955961] text-white disabled:bg-[#e5e5e5] disabled:text-[#acacac] disabled:cursor-wait"
                >
                    {pathname.startsWith('/recipe/manage/edit') && `Bewerken`}
                    {pathname.startsWith('/recipe/manage/add') && `Toevoegen`}
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
};
