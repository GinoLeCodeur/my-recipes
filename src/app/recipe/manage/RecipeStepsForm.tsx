'use client';

import { RecipeStep } from '@/types';
import { ChangeEvent, useEffect, useState } from 'react';

export const RecipeStepsForm = ({
    recipeStepsData,
    handleRecipeSteps,
}: {
    recipeStepsData?: RecipeStep[];
    handleRecipeSteps: (data: RecipeStep[]) => void;
}) => {
    const [recipeSteps, setRecipeSteps] = useState<RecipeStep[]>([
        {
            recipeStepId: 0,
            description: ''
        },
    ]);

    const handleChange = (rowIndex: number) => async (event: ChangeEvent<HTMLTextAreaElement>) => {
        const name = event.target.name.split('_')[0];
        const value = event.target.value;

        const newRecipeSteps = recipeSteps.map(
            (step: RecipeStep, index: number) => {
                if (index === rowIndex) {
                    return {
                        ...step,
                        [name]: value,
                    };
                }
                return step;
            }
        ) as RecipeStep[];

        setRecipeSteps([...newRecipeSteps]);
    };

    const addRecipeStep = () => {
        const newRecipeStep: RecipeStep = {
            recipeStepId: 0,
            description: ''
        };
        const newRecipeSteps = [...recipeSteps, newRecipeStep];

        setRecipeSteps([...newRecipeSteps]);
    };

    const removeRecipeStep = (rowIndex: number) => {
        if (recipeSteps.length <= 1) {
            setRecipeSteps([
                {
                    recipeStepId: 0,
                    description: ''
                }
            ]);
            return;
        }
        const newRecipeSteps = recipeSteps;
        newRecipeSteps.splice(rowIndex, 1);

        setRecipeSteps([...newRecipeSteps]);
    };

    useEffect(() => {
        if (recipeStepsData && recipeStepsData.length > 0) {
            setRecipeSteps([...recipeStepsData]);
        }
    }, [recipeStepsData]);

    useEffect(() => {
        handleRecipeSteps(recipeSteps);
    }, [recipeSteps]);

    return (
        <div className="mb-6">
            <h4 id="recipe_steps" className="mb-2 font-bold">
                Stappen
            </h4>
            {recipeSteps?.map((step, index) => (
                <div key={index} className="relative flex items-center mb-2">
                    <textarea
                        name={`description_${index}`}
                        value={step.description}
                        className="block w-full h-[200px] mr-[4px] p-2 bg-white autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)] resize-none"
                        onChange={handleChange(index)}
                        aria-labelledby="recipe_steps"
                    />
                    <button
                        type="button"
                        className="flex items-center justify-center w-[40px] h-[40px] bg-[#d7b4b9]"
                        onClick={() => removeRecipeStep(index)}
                        title="Stap verwijderen"
                    >
                        <span className="block material-symbols-outlined -mb-[2px] text-white">
                            delete
                        </span>
                    </button>
                </div>
            ))}
            <div>
                <button
                    type="button"
                    className="inline-flex items-center mt-1 text-sm"
                    onClick={addRecipeStep}
                >
                    <span className="block material-symbols-outlined mr-1 -mb-[1px]">
                        add
                    </span>
                    Stap toevoegen
                </button>
            </div>
        </div>
    );
};
