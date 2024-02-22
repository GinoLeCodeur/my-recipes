export type Recipe = {
    recipeId: number;
    name: string;
    slug: string;
    description?: string;
    image?: string;
};

export type RecipeStep = {
    recipeStepId: number;
    description: string;
    order?: number;
};

export type Ingredient = {
    ingredientId: number;
    name: string;
    quantity?: number;
    unit?: string;
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