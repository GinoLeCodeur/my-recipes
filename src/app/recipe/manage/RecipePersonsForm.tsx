'use client';

import { useEffect, useState } from 'react';

export const RecipePersonsForm = ({
    recipePersonsData,
    handleRecipePersons,
}: {
    recipePersonsData?: number;
    handleRecipePersons: (data: number) => void;
}) => {
    const [recipePersons, setRecipePersons] = useState<number>(1);
    
    const removePerson = () => {
        if (recipePersons > 1) {
            setRecipePersons(recipePersons - 1);
        }
    }
    
    const addPerson = () => setRecipePersons(recipePersons + 1);

    useEffect(() => {
        setRecipePersons(recipePersonsData || 1);
    }, [recipePersonsData]);

    useEffect(() => {
        handleRecipePersons(recipePersons);
    }, [recipePersons]);

    return (
        <div className="flex mb-2">
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
                {recipePersons +
                    (recipePersons > 1 ? ' personen' : ' persoon')}
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
    );
};
