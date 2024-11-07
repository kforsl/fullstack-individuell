interface Recipe {
    _id: string;
    title: string;
    description: string;
    tags: string[];
    imageUrl: string[];
    createdBy: BasicUser;
    createdAt: Date;
    comments: RecipeComment[];
}
interface BasicUser {
    _id: string;
    username: string;
    experienceLevel: string;
    profilePictureUrl: string;
}
interface RecipeComment {
    content: string;
    createdAt: Date;
    createdBy: BasicUser;
    recipeId: string;
}
interface InteractionIcon {
    url: string;
    type: string;
    onClick: (btnRef: HTMLImageElement) => void;
}
