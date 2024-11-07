addEventListener("load", async () => {
    try {
        const recipes: Recipe[] = await getAllRecipeFromStore();
        localStorage.setItem("recipes", JSON.stringify(recipes));
        recipes.forEach((recipe) => {
            generatePostCard(recipe, "popularPostContainer");
        });
        populateFollowingSection(recipes);
        populateBookmarkPage(recipes);
    } catch (error) {
        console.log(error);
    }
    changeLikedIcon();
    changeBookmarkedIcon();
    changeFollowingIcon();
    addEventListeners();

    document.querySelector<HTMLElement>(".start-page")?.classList.remove("hidden");
    document.querySelector<HTMLElement>(".navigation")?.classList.remove("hidden");
    document.querySelector<HTMLElement>(".loading")?.classList.add("hidden");
});
function addEventListeners(): void {
    const startPagePostOptions: NodeListOf<HTMLLIElement> = document.querySelectorAll(".start-page__nav-list-item");
    startPagePostOptions?.forEach((Ele) =>
        Ele.addEventListener("click", () => onClickFunctionStartPagePostOptions(Ele))
    );

    const navItemRefs: NodeListOf<HTMLLIElement> = document.querySelectorAll(".navigation__list-item");
    navItemRefs.forEach((navItem) =>
        navItem.addEventListener("click", () => {
            onClickNavigateFunction(navItem);
        })
    );

    const bookmarkCategoryRefs: NodeListOf<HTMLImageElement> = document.querySelectorAll(".bookmark__category");
    bookmarkCategoryRefs?.forEach((category) =>
        category.addEventListener("click", () => openBookmarkCategory(category))
    );
}

// STORE FUNCTIONS
async function getAllRecipeFromStore(): Promise<Recipe[]> {
    try {
        const response: Response = await window.fetch(`https://kforsl.github.io/recipes-api/data/recipe.json`);

        if (!response.ok) {
            throw new Error(`Något gick Fel`);
        }

        const recipes: Recipe[] = await response.json();
        return recipes;
    } catch (error) {
        console.log(error);
        return [];
    }
}

function getRecipeFromStoreById(id: string): Recipe[] {
    try {
        const storeResponse = localStorage.getItem("recipes") as string;

        if (storeResponse) {
            const recipes: Recipe[] = JSON.parse(storeResponse);
            const recipe = recipes.find((recipe) => recipe._id === id) as Recipe;
            return [recipe];
        }
        return [];
    } catch (error) {
        console.log(error);
        return [];
    }
}
function saveLikedRecipeToStore(id: string): void {
    const foundRecipe: Recipe[] = getRecipeFromStoreById(id);
    const storeResponse = localStorage.getItem("likedRecipes") as string;
    if (storeResponse) {
        const likedRecipesArray: Recipe[] = JSON.parse(storeResponse);
        likedRecipesArray.forEach((recipe) => {
            if (recipe._id !== id) foundRecipe.push(recipe);
        });
    }
    localStorage.setItem("likedRecipes", JSON.stringify(foundRecipe));
    generateLikedRecipesCards(foundRecipe);
}
function saveBookmarkedRecipeToStore(id: string): void {
    const foundRecipe: Recipe[] = getRecipeFromStoreById(id);
    const storeResponse = localStorage.getItem("bookmarkedRecipes") as string;
    if (storeResponse) {
        const bookmarkedRecipesArray: Recipe[] = JSON.parse(storeResponse);
        bookmarkedRecipesArray.forEach((recipe) => {
            if (recipe._id !== id) foundRecipe.push(recipe);
        });
    }
    localStorage.setItem("bookmarkedRecipes", JSON.stringify(foundRecipe));
    generateSavedRecipesCards(foundRecipe);
}
async function saveFavoritUserToStore(id: string): Promise<void> {
    const followedUserIdArray = [id.split("-")[1]];
    const storeResponse = localStorage.getItem("followedUsers") as string;
    if (storeResponse) {
        const followedUsersArray: string[] = JSON.parse(storeResponse);
        followedUsersArray.forEach((user) => followedUserIdArray.push(user));
    }
    localStorage.setItem("followedUsers", JSON.stringify(followedUserIdArray));
    const recipesStore = localStorage.getItem("recipes") as string;
    if (recipesStore) {
        populateFollowingSection(JSON.parse(recipesStore));
    }
}
function removeLikedRecipeFromStore(id: string): void {
    const storeResponse = localStorage.getItem("likedRecipes") as string;
    if (storeResponse) {
        const recipes: Recipe[] = JSON.parse(storeResponse);
        const filterdRecipes: Recipe[] = recipes.filter((recipe) => recipe._id !== id);
        localStorage.setItem("likedRecipes", JSON.stringify(filterdRecipes));
        generateLikedRecipesCards(filterdRecipes);
    }
}
function removeBookmarkedRecipeFromStore(id: string): void {
    const storeResponse = localStorage.getItem("bookmarkedRecipes") as string;
    if (storeResponse) {
        const recipes: Recipe[] = JSON.parse(storeResponse);
        const filterdRecipes: Recipe[] = recipes.filter((recipe) => recipe._id !== id);
        localStorage.setItem("bookmarkedRecipes", JSON.stringify(filterdRecipes));
        generateSavedRecipesCards(filterdRecipes);
    }
}
function removeFavoritUserToStore(id: string): void {
    const storeResponse = localStorage.getItem("followedUsers") as string;
    if (storeResponse) {
        const followedUsers: string[] = JSON.parse(storeResponse);
        const filterdFollowedUsers = followedUsers.filter((userId) => userId !== id.split("-")[1]);

        localStorage.setItem("followedUsers", JSON.stringify(filterdFollowedUsers));
        const recipesStore = localStorage.getItem("recipes") as string;
        if (recipesStore) {
            populateFollowingSection(JSON.parse(recipesStore));
        }
    }
}

// CHANGE ICONS
function changeLikedIcon(): void {
    const storeResponse = localStorage.getItem("likedRecipes") as string;
    if (storeResponse) {
        const likedRecipesArray: Recipe[] = JSON.parse(storeResponse);
        likedRecipesArray.forEach((recipe) => {
            const LikedIconRef = document.querySelectorAll(`#like-${recipe._id}`) as NodeListOf<HTMLImageElement>;
            if (LikedIconRef) {
                LikedIconRef.forEach((icon) => {
                    icon.src = "./assets/icons/icon-park-solid_like.svg";
                });
            }
        });
    }
}
function changeBookmarkedIcon(): void {
    const storeResponse = localStorage.getItem("bookmarkedRecipes") as string;
    if (storeResponse) {
        const bookmarkedRecipesArray: Recipe[] = JSON.parse(storeResponse);
        bookmarkedRecipesArray.forEach((recipe) => {
            const bookmarkedIconRef = document.querySelectorAll(
                `#bookmark-${recipe._id}`
            ) as NodeListOf<HTMLImageElement>;
            if (bookmarkedIconRef) {
                bookmarkedIconRef.forEach((icon) => {
                    icon.src = "./assets/icons/material-symbols_bookmark.svg";
                });
            }
        });
    }
}
function changeFollowingIcon(): void {
    const storeResponse = localStorage.getItem("followedUsers") as string;

    if (storeResponse) {
        const followedUsersArray: Recipe[] = JSON.parse(storeResponse);
        followedUsersArray.forEach((userId) => {
            const followBtnRef = document.querySelectorAll(`#follow-${userId}`) as NodeListOf<Element>;
            if (followBtnRef) {
                followBtnRef.forEach((btn) => {
                    btn.classList.add("post__card-btn--active");
                    btn.textContent = "Following";
                });
            }
        });
    }
}

// OnClick Functions
function onClickFunctionStartPagePostOptions(btnRef: Element): void {
    if (btnRef.textContent === "Popular") {
        if (!btnRef.classList.contains("start-page__nav-list-item--active")) {
            const nowActiveNav = document.querySelector(".start-page__nav-list-item--active") as HTMLElement;
            nowActiveNav.classList.remove("start-page__nav-list-item--active");
            btnRef.classList.add("start-page__nav-list-item--active");
            document.querySelector("#popularPostContainer")?.classList.remove("hidden");
            document.querySelector("#followingPostContainer")?.classList.add("hidden");
        }
    } else if (btnRef.textContent === "Following") {
        if (!btnRef.classList.contains("start-page__nav-list-item--active")) {
            const nowActiveNav = document.querySelector(".start-page__nav-list-item--active") as HTMLElement;
            nowActiveNav.classList.remove("start-page__nav-list-item--active");
            btnRef.classList.add("start-page__nav-list-item--active");
            document.querySelector("#popularPostContainer")?.classList.add("hidden");
            document.querySelector("#followingPostContainer")?.classList.remove("hidden");
        }
    }
}
function onClickNavigateFunction(navItemRef: Element): void {
    switch (navItemRef.id) {
        case "navigationHome":
            NavigateToHomePage();
            break;
        case "navigationSearch":
            NavigateToSearchPage();
            break;
        case "navigationAdd":
            NavigateToAddPage();
            break;
        case "navigationBookmark":
            NavigateToBookmarkPage();
            break;
        case "navigationProfile":
            NavigateToProfilePage();
            break;
    }
}
function onClickFunctionFollowBtn(btnRef: Element): void {
    if (btnRef.classList.contains("post__card-btn--active")) {
        btnRef.classList.remove("post__card-btn--active");
        btnRef.textContent = "Follow";
        removeFavoritUserToStore(btnRef.id);
    } else {
        btnRef.classList.add("post__card-btn--active");
        btnRef.textContent = "Following";
        saveFavoritUserToStore(btnRef.id);
    }
}
async function onClickFunctionLike(btnRef: HTMLImageElement): Promise<void> {
    const recipeId = btnRef.id.split("-")[1];

    const LikedIconRef = document.querySelectorAll(`#like-${recipeId}`) as NodeListOf<HTMLImageElement>;
    if (LikedIconRef) {
        LikedIconRef.forEach((icon) => {
            if (!icon.src.includes("outline")) {
                icon.src = "./assets/icons/icon-park-outline_like.svg";
                removeLikedRecipeFromStore(recipeId);
            } else {
                icon.src = "./assets/icons/icon-park-solid_like.svg";
                saveLikedRecipeToStore(recipeId);
            }
        });
    }
}
async function onClickFunctionComment(btnRef: HTMLImageElement): Promise<void> {
    console.log("Comment", btnRef);
}
async function onClickFunctionShare(btnRef: HTMLImageElement): Promise<void> {
    console.log("Share", btnRef);
}
async function onClickFunctionBookmark(btnRef: HTMLImageElement): Promise<void> {
    const recipeId = btnRef.id.split("-")[1];
    const bookmarkIconRef = document.querySelectorAll(`#bookmark-${recipeId}`) as NodeListOf<HTMLImageElement>;
    if (bookmarkIconRef) {
        bookmarkIconRef.forEach((icon) => {
            if (!icon.src.includes("outline")) {
                icon.src = "./assets/icons/material-symbols_bookmark-outline.svg";
                removeBookmarkedRecipeFromStore(recipeId);
            } else {
                icon.src = "./assets/icons/material-symbols_bookmark.svg";
                saveBookmarkedRecipeToStore(recipeId);
            }
        });
    }
}
function openBookmarkCategory(btnRef: Element): void {
    switch (btnRef.id) {
        case "savedRecipes":
            document.querySelector<Element>("#bookmarkExpander")?.classList.toggle("expanded");
            document.querySelector<Element>("#savedChevron")?.classList.toggle("open");
            break;
        case "likedRecipes":
            document.querySelector<Element>("#likedExpander")?.classList.toggle("expanded");
            document.querySelector<Element>("#likedChevron")?.classList.toggle("open");
            break;
        case "createdRecipes":
            document.querySelector<Element>("#createdExpander")?.classList.toggle("expanded");
            document.querySelector<Element>("#createdChevron")?.classList.toggle("open");
            break;
    }
}

// Generate HTML Element Functions
function populateFollowingSection(recipes: Recipe[]): void {
    const storeResponse = localStorage.getItem("followedUsers") as string;
    const mainSection = document.querySelector<Element>(`#followingPostContainer`) as HTMLElement;
    mainSection.innerHTML = "";

    if (storeResponse) {
        const followedUsersArray: string[] = JSON.parse(storeResponse);
        followedUsersArray.forEach((userId) => {
            const foundRecipe = recipes.find((recipe) => recipe.createdBy._id === userId) as Recipe;
            generatePostCard(foundRecipe, "followingPostContainer");
        });

        changeLikedIcon();
        changeBookmarkedIcon();
        changeFollowingIcon();
    }
}

// Start Page Card
function generatePostCard(recipe: Recipe, sectionId: string): void {
    const newPostEle: HTMLElement = document.createElement("article");
    newPostEle.classList.add("post__card");
    const cardHeaderEle: HTMLElement = generateCardHeader(recipe.createdBy);
    newPostEle.appendChild(cardHeaderEle);
    const imageEle: HTMLElement = generateCardImages(recipe);
    newPostEle.appendChild(imageEle);
    const cardInformationEle: HTMLElement = generateCardInformation(recipe);
    newPostEle.appendChild(cardInformationEle);
    const interactionEle: HTMLElement = generateCardInteraction(recipe);
    newPostEle.appendChild(interactionEle);
    const commentEle: HTMLElement = generateCardComments(recipe);
    newPostEle.appendChild(commentEle);
    document.querySelector<Element>(`#${sectionId}`)?.appendChild(newPostEle);
}
function generateCardHeader(createdBy: BasicUser): HTMLElement {
    const cardHeaderEle: HTMLElement = document.createElement("section");
    cardHeaderEle.classList.add("post__card-header");

    const cardAvatarEle: HTMLImageElement = document.createElement("img");
    cardAvatarEle.src = createdBy.profilePictureUrl;
    cardAvatarEle.alt = `${createdBy.username}s avatar`;
    cardAvatarEle.classList.add("post__card-avatar");
    cardHeaderEle.appendChild(cardAvatarEle);

    const cardUploaderEle: HTMLElement = document.createElement("span");
    cardUploaderEle.classList.add("post__card-poster");

    const cardUsernameEle: HTMLElement = document.createElement("h3");
    cardUsernameEle.textContent = createdBy.username;

    const cardExperienceEle: HTMLElement = document.createElement("p");
    cardExperienceEle.textContent = createdBy.experienceLevel;

    cardUploaderEle.appendChild(cardUsernameEle);
    cardUploaderEle.appendChild(cardExperienceEle);
    cardHeaderEle.appendChild(cardUploaderEle);

    const cardFollowBtnEle: HTMLElement = document.createElement("button");
    cardFollowBtnEle.classList.add("post__card-btn");
    cardFollowBtnEle.textContent = "Follow";
    cardFollowBtnEle.id = `follow-${createdBy._id}`;
    cardFollowBtnEle.addEventListener("click", () => onClickFunctionFollowBtn(cardFollowBtnEle));

    cardHeaderEle.appendChild(cardFollowBtnEle);

    return cardHeaderEle;
}
function generateCardImages(recipe: Recipe): HTMLElement {
    const cardImagesContainerEle: HTMLElement = document.createElement("figure");
    cardImagesContainerEle.classList.add("post__card-images");

    recipe.imageUrl.forEach((url) => {
        const cardImageEle: HTMLImageElement = document.createElement("img");
        cardImageEle.src = url;
        cardImageEle.alt = `Image of ${recipe.title}`;
        cardImagesContainerEle.appendChild(cardImageEle);
    });

    const cardTagsEle: HTMLElement = document.createElement("section");
    cardTagsEle.classList.add("post__card-tags");
    recipe.tags.forEach((tag) => {
        const tagsElse: HTMLElement = generateRecipeTags(tag);
        cardTagsEle.appendChild(tagsElse);
    });
    cardImagesContainerEle.appendChild(cardTagsEle);

    return cardImagesContainerEle;
}
function generateCardInformation(recipe: Recipe): HTMLElement {
    const newPostEle: HTMLElement = document.createElement("section");
    newPostEle.classList.add("post__card-information");
    const newTitleEle: HTMLElement = document.createElement("h3");
    newTitleEle.textContent = recipe.title;
    newPostEle.appendChild(newTitleEle);
    const newDateEle: HTMLElement = document.createElement("p");
    newDateEle.textContent = `${recipe.createdAt.toString().split("T")[0]}`;

    console.log(new Date(recipe.createdAt));
    newPostEle.appendChild(newDateEle);
    return newPostEle;
}
function generateCardInteraction(recipe: Recipe): HTMLElement {
    const cardInteractionsEle: HTMLElement = document.createElement("section");
    cardInteractionsEle.classList.add("post__card-interaction");

    const interactionIcons: InteractionIcon[] = [
        {
            url: "./assets/icons/icon-park-outline_like.svg",
            type: "like",
            onClick: onClickFunctionLike,
        },
        {
            url: "./assets/icons/iconamoon_comment-bold.svg",
            type: "comment",
            onClick: onClickFunctionComment,
        },
        {
            url: "./assets/icons/bitcoin-icons_share-filled.svg",
            type: "share",
            onClick: onClickFunctionShare,
        },
        {
            url: "./assets/icons/material-symbols_bookmark-outline.svg",
            type: "bookmark",
            onClick: onClickFunctionBookmark,
        },
    ];

    interactionIcons.forEach((icon) => {
        const interactionIconEle: HTMLImageElement = document.createElement("img");
        interactionIconEle.src = icon.url;
        interactionIconEle.alt = `${recipe._id} ${icon.type} icon`;
        interactionIconEle.id = `${icon.type}-${recipe._id}`;
        interactionIconEle.classList.add(`post__interaction-icon`);
        interactionIconEle.addEventListener("click", () => icon.onClick(interactionIconEle));
        cardInteractionsEle.appendChild(interactionIconEle);
    });

    return cardInteractionsEle;
}
function generateCardComments(recipe: Recipe): HTMLElement {
    if (recipe.comments.length === 0)
        recipe.comments = [
            {
                content: "This recipe had no comments",
                createdAt: new Date(),
                createdBy: {
                    _id: "Flavorly",
                    username: "Flavorly",
                    experienceLevel: "Head Chef",
                    profilePictureUrl: "./assets/avatar/Flavorly.jpg",
                },
                recipeId: recipe._id,
            },
        ];

    const cardCommentsEle: HTMLElement = document.createElement("section");
    cardCommentsEle.classList.add("post__card-comment");

    recipe.comments.forEach((comment) => {
        const avatarEle: HTMLImageElement = document.createElement("img");
        avatarEle.classList.add("post__card-avatar");
        avatarEle.src = comment.createdBy.profilePictureUrl;
        avatarEle.alt = `${comment.createdBy.username}'s avatar`;

        cardCommentsEle.appendChild(avatarEle);

        const spanEle: HTMLElement = document.createElement("span");
        const h3Ele: HTMLElement = document.createElement("h3");
        h3Ele.textContent = comment.createdBy.username;
        spanEle.appendChild(h3Ele);

        cardCommentsEle.appendChild(spanEle);

        const commentPEle: HTMLElement = document.createElement("p");
        commentPEle.textContent = comment.content;
        cardCommentsEle.appendChild(commentPEle);
    });
    return cardCommentsEle;
}

// Bookmark Page
function populateBookmarkPage(recipes: Recipe[]): void {
    generateCreatedRecipesCards(recipes);

    const bookmarkedStoreResponse = localStorage.getItem("bookmarkedRecipes") as string;
    if (bookmarkedStoreResponse) {
        const bookmarkedRecipesArray: Recipe[] = JSON.parse(bookmarkedStoreResponse);
        const savedRecipes: Recipe[] = bookmarkedRecipesArray ? bookmarkedRecipesArray : [];
        generateSavedRecipesCards(savedRecipes);
    }

    const likedStoreResponse = localStorage.getItem("likedRecipes") as string;
    if (likedStoreResponse) {
        const likedRecipesArray: Recipe[] = JSON.parse(likedStoreResponse);
        const likedRecipes: Recipe[] = likedRecipesArray ? likedRecipesArray : [];
        generateLikedRecipesCards(likedRecipes);
    }
}
function generateCreatedRecipesCards(recipes: Recipe[]): void {
    const bookmarkCreatedEle = document.querySelector("#bookmarkCreated") as HTMLElement;
    const profileBookmarkEle = document.querySelector("#profileBookmarkCreated") as HTMLElement;

    recipes.forEach((recipe) => {
        if (recipe.createdBy.username === "Flavorly") {
            const generatedCard = generateBookmarkCard(recipe);
            bookmarkCreatedEle?.appendChild(generatedCard);

            const smallGeneratedCard: HTMLElement = generateSmallBookmarkCard(recipe);
            profileBookmarkEle?.appendChild(smallGeneratedCard);
        }
    });
}
function generateSavedRecipesCards(recipes: Recipe[]): void {
    const bookmarkSavedEle = document.querySelector("#bookmarkSaved") as HTMLElement;
    const profileBookmarkEle = document.querySelector("#profileBookmarkSaved") as HTMLElement;

    bookmarkSavedEle.innerHTML = "";
    profileBookmarkEle.innerHTML = "";

    recipes.forEach((recipe) => {
        const generatedCard = generateBookmarkCard(recipe);
        bookmarkSavedEle?.appendChild(generatedCard);

        const smallGeneratedCard: HTMLElement = generateSmallBookmarkCard(recipe);
        profileBookmarkEle?.appendChild(smallGeneratedCard);
    });
}
function generateLikedRecipesCards(recipes: Recipe[]): void {
    const bookmarkLikedEle = document.querySelector("#bookmarkLiked") as HTMLElement;
    const profileBookmarkEle = document.querySelector("#profileBookmarkLiked") as HTMLElement;

    bookmarkLikedEle.innerHTML = "";
    profileBookmarkEle.innerHTML = "";
    recipes.forEach((recipe) => {
        const generatedCard = generateBookmarkCard(recipe);
        bookmarkLikedEle?.appendChild(generatedCard);

        const smallGeneratedCard: HTMLElement = generateSmallBookmarkCard(recipe);
        profileBookmarkEle?.appendChild(smallGeneratedCard);
    });
}

// Bookmark Card
function generateBookmarkCard(recipe: Recipe): HTMLElement {
    const listEle: HTMLElement = document.createElement("li");
    listEle.classList.add("bookmark__list-item");

    const articleEle: HTMLElement = document.createElement("article");
    articleEle.classList.add("bookmark__recipe-card");

    const figureEle = generateBookmarkImage(recipe);
    articleEle.appendChild(figureEle);

    const bookmarkText = generateBookmarkCardTitle(recipe);
    articleEle.appendChild(bookmarkText);

    listEle.appendChild(articleEle);

    return listEle;
}
function generateBookmarkCardTitle(recipe: Recipe): HTMLElement {
    const sectionEle: HTMLElement = document.createElement("section");
    sectionEle.classList.add("recipe-card__information-container");

    const h2Ele: HTMLHeadingElement = document.createElement("h2");
    h2Ele.textContent = recipe.title;
    sectionEle.appendChild(h2Ele);

    const tagSectionEle: HTMLElement = document.createElement("section");
    tagSectionEle.classList.add("post__search-tags");
    recipe.tags.forEach((tag) => {
        const tagEle: HTMLElement = generateRecipeTags(tag);
        tagSectionEle.appendChild(tagEle);
    });
    sectionEle.appendChild(tagSectionEle);

    const pEle: HTMLParagraphElement = document.createElement("p");
    pEle.textContent = recipe.description;
    sectionEle.appendChild(pEle);

    return sectionEle;
}
function generateBookmarkImage(recipe: Recipe): HTMLElement {
    const figureEle: HTMLElement = document.createElement("figure");
    figureEle.classList.add("recipe-card__image-container");

    const imgEle: HTMLImageElement = document.createElement("img");
    imgEle.src = recipe.imageUrl[0];
    imgEle.alt = `${recipe.title} plate`;

    figureEle.appendChild(imgEle);

    return figureEle;
}

// Small Card
function generateSmallBookmarkCard(recipe: Recipe): HTMLElement {
    const articleEle: HTMLElement = document.createElement("article");
    articleEle.classList.add("profile-page__recipes-card");

    const imgEle: HTMLImageElement = document.createElement("img");
    imgEle.src = recipe.imageUrl[0];
    imgEle.alt = `${recipe.title} plate`;

    articleEle.appendChild(imgEle);

    const h3Ele: HTMLHeadingElement = document.createElement("h3");
    h3Ele.textContent = recipe.title;

    articleEle.appendChild(h3Ele);

    return articleEle;
}

function generateRecipeTags(tag: string): HTMLElement {
    const cardTagEle: HTMLElement = document.createElement("p");
    cardTagEle.textContent = tag;
    return cardTagEle;
}

// Navigate Functions
function NavigateToHomePage(): void {
    document.querySelector<HTMLElement>(".start-page")?.classList.remove("hidden");
    document.querySelector<HTMLElement>(".search-page")?.classList.add("hidden");
    document.querySelector<HTMLElement>(".add-page")?.classList.add("hidden");
    document.querySelector<HTMLElement>(".bookmark-page")?.classList.add("hidden");
    document.querySelector<HTMLElement>(".profile-page")?.classList.add("hidden");
}
function NavigateToSearchPage(): void {
    document.querySelector<HTMLElement>(".start-page")?.classList.add("hidden");
    document.querySelector<HTMLElement>(".search-page")?.classList.remove("hidden");
    document.querySelector<HTMLElement>(".add-page")?.classList.add("hidden");
    document.querySelector<HTMLElement>(".bookmark-page")?.classList.add("hidden");
    document.querySelector<HTMLElement>(".profile-page")?.classList.add("hidden");
}
function NavigateToAddPage(): void {
    document.querySelector<HTMLElement>(".start-page")?.classList.add("hidden");
    document.querySelector<HTMLElement>(".search-page")?.classList.add("hidden");
    document.querySelector<HTMLElement>(".add-page")?.classList.remove("hidden");
    document.querySelector<HTMLElement>(".bookmark-page")?.classList.add("hidden");
    document.querySelector<HTMLElement>(".profile-page")?.classList.add("hidden");
}
function NavigateToBookmarkPage(): void {
    document.querySelector<HTMLElement>(".start-page")?.classList.add("hidden");
    document.querySelector<HTMLElement>(".search-page")?.classList.add("hidden");
    document.querySelector<HTMLElement>(".add-page")?.classList.add("hidden");
    document.querySelector<HTMLElement>(".bookmark-page")?.classList.remove("hidden");
    document.querySelector<HTMLElement>(".profile-page")?.classList.add("hidden");
}
function NavigateToProfilePage(): void {
    document.querySelector<HTMLElement>(".start-page")?.classList.add("hidden");
    document.querySelector<HTMLElement>(".search-page")?.classList.add("hidden");
    document.querySelector<HTMLElement>(".add-page")?.classList.add("hidden");
    document.querySelector<HTMLElement>(".bookmark-page")?.classList.add("hidden");
    document.querySelector<HTMLElement>(".profile-page")?.classList.remove("hidden");
}
