import { FormEvent } from "react";
import CreateRecipeForm from "./CreateRecipeForm";

export default async function Page() {
    
    return (
        <>
            <h1 className="flex-1 text-4xl font-medium">Recept toevoegen</h1>
            <CreateRecipeForm />
        </>
    );
}