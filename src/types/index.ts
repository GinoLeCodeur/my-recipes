export type Recipe = {
    recipeId?: number;
    name: string;
    slug: string;
    description?: string;
    persons?: number;
    image?: string;
    createdBy?: number;
};

export type RecipeStep = {
    recipeStepId: number;
    description: string;
    order?: number;
};

export type Ingredient = {
    ingredientId?: number;
    name?: string;
    quantity?: number;
    unit?: string;
    order?: number;
};

export const enum UserRole {
    USER = "user",
    ADMIN = "admin",
}

export type User = {
    userId?: number;
    password?: string;
    name?: string;
    email?: string;
    role?: UserRole;
};