interface BasicUser {
    _id: string;
    username: string;
    experienceLevel: string;
    profilePictureUrl: string;
    numberOfFollowers: number;
}
interface Recipe {
    _id: string;
    title: string;
    description: string;
    tags: string[];
    ingredients: Ingredient[];
    instructions: Instruction[];
    imageUrl: string[];
    createdBy: BasicUser;
    createdAt: Date;
    likes: BasicUser[];
    comments: RecipeComment[];
}
interface BasicRecipe {
    _id: string;
    title: string;
    tags: string[];
    description: string;
    imageUrl: string[];
    createdBy: BasicUser;
    createdAt: Date;
    numberOfLikes: number;
}
interface RecipeComment {
    content: string;
    createdAt: Date;
    createdBy: BasicUser;
    recipe: BasicRecipe;
}
interface Ingredient {
    name: string;
    amount: number;
    measurementUnit: string;
}
interface Instruction {
    step: number;
    description: string;
}
interface apiResponse {
    success: boolean;
    error?: string;
    recipes?: Recipe[];
}
interface InteractionIcon {
    url: string;
    type: string;
    onClick: (btnRef: HTMLImageElement) => void;
}
