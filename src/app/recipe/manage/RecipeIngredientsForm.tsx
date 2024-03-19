'use client';

import { Ingredient } from '@/types';
import { ChangeEvent, useEffect, useState } from 'react';
import { getIngredients } from '../actions';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { notoSans } from '@/libs/fonts';

export const RecipeIngredientsForm = ({
    recipeIngredientsData,
    handleRecipeIngredients
}: {
    recipeIngredientsData?: Ingredient[];
    handleRecipeIngredients: (data: Ingredient[]) => void;
}) => {
    const [ingredientsData, setIngredientsData] = useState<Ingredient[]>([]);
    const [recipeIngredients, setRecipeIngredients] = useState<Ingredient[]>([
        {
            ingredientId: 0,
            name: '',
            quantity: 0,
            unit: '',
        },
    ]);

    const fetchIngredients = async () => {
        const { rows: getIngredientsData } = await getIngredients();
        if (getIngredientsData.length > 0) {
            setIngredientsData(getIngredientsData);
        }
    };

    const handleChange =
        (rowIndex: number) => async (event: ChangeEvent<HTMLInputElement>) => {
            const name = event.target.name.split('_')[0];
            const value =
                event.target.type !== 'number'
                    ? event.target.value
                    : event.target.valueAsNumber;

            const newRecipeIngredients = recipeIngredients.map(
                (ingredient: Ingredient, index: number) => {
                    if (index === rowIndex) {
                        return {
                            ...ingredient,
                            [name]: value
                        };
                    }
                    return ingredient;
                }
            ) as Ingredient[];

            setRecipeIngredients([...newRecipeIngredients]);
        };

    const handleIngredientChange = async (rowIndex: number, value: string | null) => {
        const findIngredient = ingredientsData.find(
            (ingredient) => ingredient.name === value
        );
        const newRecipeIngredients = recipeIngredients.map(
            (ingredient: Ingredient, index: number) => {
                if (index === rowIndex) {
                    return {
                        ...ingredient,
                        ingredientId: findIngredient?.ingredientId || 0,
                        name: value,
                        unit: findIngredient?.unit || ingredient.unit,
                    };
                }
                
                return ingredient;
            }
        ) as Ingredient[];

        setRecipeIngredients([...newRecipeIngredients]);
    };

    const addRecipeIngredient = () => {
        const newIngredient: Ingredient = {
            ingredientId: 0,
            name: '',
            quantity: 0,
            unit: '',
        };
        const newRecipeIngredients = [...recipeIngredients, newIngredient];

        setRecipeIngredients([...newRecipeIngredients]);
    };

    const removeRecipeIngredient = (rowIndex: number) => {
        if (recipeIngredients.length <= 1) {
            setRecipeIngredients([
                {
                    ingredientId: 0,
                    name: '',
                    quantity: 0,
                    unit: ''
                }
            ]);
            return;
        }
        const newRecipeIngredients = recipeIngredients;
        newRecipeIngredients.splice(rowIndex, 1);

        setRecipeIngredients([...newRecipeIngredients]);
    };

    useEffect(() => {
        fetchIngredients();
    }, []);

    useEffect(() => {
        if (recipeIngredientsData && recipeIngredientsData.length > 0) {
            setRecipeIngredients([...recipeIngredientsData]);
        }
    }, [recipeIngredientsData]);

    useEffect(() => {
        handleRecipeIngredients(recipeIngredients);
    }, [recipeIngredients]);

    return (
        <div className="mb-6">
            <h4 className="mb-2 font-bold">Ingrediënten</h4>
            <table className="w-full !border-separate border-spacing-[2px] -m-[2px]">
                <thead>
                    <tr>
                        <th
                            className="text-left font-normal italic text-sm"
                            id="ingredient_name"
                        >
                            Ingrediënt naam
                        </th>
                        <th
                            className="text-left w-[80px] font-normal italic text-sm"
                            id="ingredient_quantity"
                        >
                            Aantal
                        </th>
                        <th
                            className="text-left w-[200px] font-normal italic text-sm"
                            id="ingredient_unit"
                        >
                            Eenheid
                        </th>
                        <th className="text-left w-[1px] font-normal italic text-sm"></th>
                    </tr>
                </thead>
                <tbody>
                    {recipeIngredients?.map((ingredient, index) => (
                        <tr key={index}>
                            <td>
                                <Autocomplete
                                    inputValue={ingredient.name}
                                    onInputChange={(e, value) =>
                                        handleIngredientChange(
                                            index,
                                            value as string
                                        )
                                    }
                                    disablePortal
                                    options={ingredientsData}
                                    getOptionLabel={(
                                        option: string | Ingredient
                                    ) =>
                                        (typeof option === 'string'
                                            ? option
                                            : option.name) as string
                                    }
                                    freeSolo
                                    disableClearable
                                    sx={{
                                        '&& .MuiOutlinedInput-root': {
                                            padding: '0 !important',
                                        },
                                        '& input': {
                                            padding: '.5rem !important',
                                            backgroundColor: '#fff',
                                            fontFamily:
                                                notoSans.style.fontFamily,
                                        },
                                        '& input:disabled': {
                                            backgroundColor: '#ece6e0',
                                            WebkitTextFillColor: '#000',
                                        },
                                        '& fieldset': {
                                            border: 'none',
                                        },
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} />
                                    )}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    name={`quantity_${index}`}
                                    min="0"
                                    value={ingredient.quantity}
                                    onChange={handleChange(index)}
                                    className="w-full p-2"
                                    aria-labelledby="ingredient_quantity"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    name={`unit_${index}`}
                                    value={ingredient.unit}
                                    onChange={handleChange(index)}
                                    className="w-full p-2 disabled:bg-[#ece6e0]"
                                    aria-labelledby="ingredient_unit"
                                    disabled={ingredient.ingredientId !== 0}
                                />
                            </td>
                            <td>
                                <button
                                    type="button"
                                    className="flex items-center justify-center w-[40px] h-[40px] bg-[#d7b4b9]"
                                    onClick={() =>
                                        removeRecipeIngredient(index)
                                    }
                                    title="Ingrediënt verwijderen"
                                >
                                    <span className="block material-symbols-outlined -mb-[2px] text-white">
                                        delete
                                    </span>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button
                    type="button"
                    className="inline-flex items-center mt-1 text-sm"
                    onClick={addRecipeIngredient}
                >
                    <span className="block material-symbols-outlined mr-1 -mb-[1px]">
                        add
                    </span>
                    Ingredient toevoegen
                </button>
            </div>
        </div>
    );
};
