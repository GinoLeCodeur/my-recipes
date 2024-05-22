'use client';

import { Ingredient, Recipe } from "@/types";
import { useEffect, useState } from "react";

export const RecipeIngredients = ({
    recipeData,
    recipeIngredientsData,
}: {
    recipeData: Recipe;
    recipeIngredientsData: Ingredient[];
}) => {
    const [selectedPersons, setSelectedPersons] = useState<number>(1);

    const removePerson = () => {
        if (selectedPersons > 1) {
            setSelectedPersons(selectedPersons - 1);
        }
    };

    const addPerson = () => setSelectedPersons(selectedPersons + 1);

    const calcIngredientQty = (ingredient: Ingredient) => {
        const defaultQuantity = ingredient.quantity || 0;
        const defaultPersons = recipeData.persons || 0;

        return +((defaultQuantity / defaultPersons) * selectedPersons).toFixed(1);
    };

    useEffect(() => {
        setSelectedPersons(recipeData?.persons || 1);
    }, [recipeData]);

    return (
        <>
            <h4 className="font-bold">Ingrediënten</h4>
            {recipeIngredientsData.length ? (
                <>
                    <div className="flex my-2">
                        <button
                            type="button"
                            className="flex items-center justify-center w-[40px] h-[40px] bg-[#d7b4b9]"
                            onClick={removePerson}
                        >
                            <span className="block material-symbols-outlined text-white">
                                remove
                            </span>
                        </button>
                        <div className="flex-1 mx-[4px] p-2 bg-white text-center">
                            {selectedPersons +
                                (selectedPersons > 1 ? ' personen' : ' persoon')}
                        </div>
                        <button
                            type="button"
                            className="flex items-center justify-center w-[40px] h-[40px] bg-[#d7b4b9]"
                            onClick={addPerson}
                        >
                            <span className="block material-symbols-outlined -mb-[1px] text-white">
                                add
                            </span>
                        </button>
                    </div>
                    <ol>
                        {recipeIngredientsData.map((ingredient) => (
                            <li key={ingredient.ingredientId}>
                                {calcIngredientQty(ingredient)}
                                {` ${ingredient.unit?.toLowerCase()}`}
                                {` ${ingredient.name?.toLowerCase()}`}
                            </li>
                        ))}
                    </ol>
                </>
            ) : (
                <p>Geen ingrediënten gevonden</p>
            )}
        </>
    );
};
