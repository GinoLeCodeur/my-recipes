'use client';

import { Recipe, RecipeStep } from '@/types';
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
            description: '',
            order: 0
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
            description: '',
            order: recipeSteps.length
        };
        const newRecipeSteps = [...recipeSteps, newRecipeStep];

        setRecipeSteps([...newRecipeSteps]);
    };

    const removeRecipeStep = (rowIndex: number) => {
        if (recipeSteps.length <= 1) {
            setRecipeSteps([
                {
                    recipeStepId: 0,
                    description: '',
                    order: 0
                }
            ]);
            return;
        }
        const newRecipeSteps = recipeSteps;
        newRecipeSteps.splice(rowIndex, 1);

        setRecipeSteps([...newRecipeSteps]);
    };

    const reorderStep = (step: RecipeStep, position: 'up' | 'down') => {
        if (
            (step.order === 0 && position === 'up') ||
            (step.order === (recipeSteps.length - 1) && position === 'down')
        ) {
            alert('Recept stap kan niet verplaatst worden!');
            return;
        }
        
        const newRecipeSteps = [...recipeSteps];

        switch (position) {
            case 'up': 
                newRecipeSteps.map((originalStep) => {
                    switch (originalStep.order) {
                        case step.order:
                            return {
                                ...originalStep,
                                order: originalStep.order--
                            }
                        case step.order - 1:
                            return {
                                ...originalStep,
                                order: originalStep.order++,
                            };
                    }
                }); 
                break;
            case 'down':
                newRecipeSteps.reverse().map((originalStep) => {
                    switch (originalStep.order) {
                        case step.order:
                            return {
                                ...originalStep,
                                order: originalStep.order++,
                            };
                        case step.order + 1:
                            return {
                                ...originalStep,
                                order: originalStep.order--,
                            };
                    }
                }); 
                break;
        }
        newRecipeSteps.sort((a, b) => a.order - b.order);

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
                <div key={index} className="relative flex items-stretch mb-2">
                    <textarea
                        name={`description_${index}`}
                        value={step.description}
                        className="block w-full mr-[4px] p-2 bg-white autofill:shadow-[inset_0_0_0px_1000px_rgb(255,255,255)] resize-none fs-content"
                        onChange={handleChange(index)}
                        aria-labelledby="recipe_steps"
                    />
                    <div className="flex flex-col justify-center gap-1">
                        <button
                            type="button"
                            className="flex items-center justify-center w-[40px] h-[40px] bg-[#d7b4b9] disabled:bg-[#ece6e0]"
                            onClick={() => reorderStep(step, 'up')}
                            title="Verplaats omhoog"
                            disabled={step.order === 0}
                        >
                            <span className="block material-symbols-outlined -mb-[2px] text-white">
                                arrow_upward
                            </span>
                        </button>
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
                        <button
                            type="button"
                            className="flex items-center justify-center w-[40px] h-[40px] bg-[#d7b4b9] disabled:bg-[#ece6e0]"
                            onClick={() => reorderStep(step, 'down')}
                            title="Verplaats omlaag"
                            disabled={step.order === (recipeSteps.length - 1)}
                        >
                            <span className="block material-symbols-outlined -mb-[2px] text-white">
                                arrow_downward
                            </span>
                        </button>
                    </div>
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
