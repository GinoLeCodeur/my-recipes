'use client';

import { useEffect, useState } from 'react';

export const RecipeImageForm = ({
    recipeImageData,
    handleRecipeCurrentImage,
    handleRecipeNewImage,
}: {
    recipeImageData?: string;
    handleRecipeCurrentImage: (data?: string) => void;
    handleRecipeNewImage: (data?: File | null) => void;
}) => {
    const [currentImage, setCurrentImage] = useState<string>();
    const [newImage, setNewImage] = useState<File | null>();

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
    };

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        event.currentTarget.classList.remove('border-dashed', 'bg-[#d7b4b9]');
        event.currentTarget.classList.add('border-solid', 'bg-[#faf7f7]');
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>): void => {
        if (
            event.relatedTarget &&
            event.currentTarget.contains(event.relatedTarget as Node)
        ) {
            return;
        }

        event.currentTarget.classList.remove('border-solid', 'bg-[#faf7f7]');
        event.currentTarget.classList.add('border-dashed', 'bg-[#d7b4b9]');
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>): void => {
        event.preventDefault();

        const droppedFiles = Array.from(event.dataTransfer.files);

        event.currentTarget.classList.remove('border-solid', 'bg-[#faf7f7]');
        event.currentTarget.classList.add('border-dashed', 'bg-[#d7b4b9]');

        if (droppedFiles.length > 0 && checkFile(droppedFiles[0])) {
            setNewImage(droppedFiles[0]);
        }
    };

    const handleImageInput = (
        event: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const imageFiles = event.target.files;

        if (imageFiles && imageFiles.length > 0 && checkFile(imageFiles[0])) {
            setNewImage(imageFiles[0]);
        }
    };

    const checkFile = (file: File): boolean => {
        const allowedImageTypes = ['image/png', 'image/jpeg'];

        if (!allowedImageTypes.includes(file.type)) {
            alert('Alleen JPEG en PNG afbeeldingen zijn toegestaan.');
            return false;
        }
        if (file.size > 5242880) {
            alert('Afbeelding mag niet groter zijn dan 5MB.');
            return false;
        }

        return true;
    };

    const removeRecipeImage = (): void => {
        setCurrentImage('');
        setNewImage(null);
        handleRecipeCurrentImage('');
    };

    useEffect(() => {
        if (recipeImageData) {
            setCurrentImage(recipeImageData);
        }
    }, [recipeImageData]);

    useEffect(() => {
        handleRecipeNewImage(newImage);
    }, [newImage, handleRecipeNewImage]);

    if (currentImage || newImage) {
        return (
            <div className="flex flex-col items-center justify-center mb-6 p-2 bg-white border-2 border-dashed border-[#d7b4b9]">
                <div className="group relative">
                    {currentImage && !newImage && (
                        <img src={currentImage} alt="" />
                    )}
                    {!currentImage && newImage && (
                        <img src={URL.createObjectURL(newImage)} alt="" />
                    )}
                    <div className="hidden group-hover:flex items-center justify-center bg-[rgba(215,180,185,.5)] absolute left-0 top-0 size-full">
                        <button
                            type="button"
                            className="flex items-center justify-center w-[40px] h-[40px] bg-[#d7b4b9]"
                            title="Afbeelding verwijderen"
                            onClick={removeRecipeImage}
                        >
                            <span className="block material-symbols-outlined -mb-[2px] text-white">
                                delete
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div
                className="flex flex-col items-center justify-center h-[200px] mb-6 bg-white border-2 border-dashed border-[#d7b4b9]"
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <label
                    htmlFor="recipe-image"
                    className="flex items-center cursor-pointer pointer-events-auto"
                >
                    Kies een afbeelding
                    <span className="material-symbols-outlined ml-1 mb-[-2px]">
                        upload
                    </span>
                </label>
                <div className="pointer-events-none">
                    of sleep een afbeelding hierheen.
                </div>
                <input
                    type="file"
                    name="recipe_image"
                    id="recipe-image"
                    accept="image/jpeg,image/png"
                    onChange={handleImageInput}
                    hidden
                />
            </div>
        );
    }
};
