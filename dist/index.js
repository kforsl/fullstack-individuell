"use strict";
addEventListener("load", async () => {
    try {
        const recipes = await getAllRecipeFromStore();
        localStorage.setItem("recipes", JSON.stringify(recipes));
        recipes.forEach((recipe) => {
            generatePostCard(recipe, "popularPostContainer");
        });
        populateFollowingSection(recipes);
        populateBookmarkPage(recipes);
    }
    catch (error) {
        console.log(error);
    }
    changeLikedIcon();
    changeBookmarkedIcon();
    changeFollowingIcon();
    addEventListeners();
    document.querySelector(".start-page")?.classList.remove("hidden");
    document.querySelector(".navigation")?.classList.remove("hidden");
    document.querySelector(".loading")?.classList.add("hidden");
});
function addEventListeners() {
    const startPagePostOptions = document.querySelectorAll(".start-page__nav-list-item");
    startPagePostOptions?.forEach((Ele) => Ele.addEventListener("click", () => onClickFunctionStartPagePostOptions(Ele)));
    const navItemRefs = document.querySelectorAll(".navigation__list-item");
    navItemRefs.forEach((navItem) => navItem.addEventListener("click", () => {
        onClickNavigateFunction(navItem);
    }));
    const bookmarkCategoryRefs = document.querySelectorAll(".bookmark__category");
    bookmarkCategoryRefs?.forEach((category) => category.addEventListener("click", () => openBookmarkCategory(category)));
}
async function getAllRecipeFromStore() {
    try {
        const response = await window.fetch(`https://kforsl.github.io/recipes-api/data/recipe.json`);
        if (!response.ok) {
            throw new Error(`Något gick Fel`);
        }
        const recipes = await response.json();
        return recipes;
    }
    catch (error) {
        console.log(error);
        return [];
    }
}
function getRecipeFromStoreById(id) {
    try {
        const storeResponse = localStorage.getItem("recipes");
        if (storeResponse) {
            const recipes = JSON.parse(storeResponse);
            const recipe = recipes.find((recipe) => recipe._id === id);
            return [recipe];
        }
        return [];
    }
    catch (error) {
        console.log(error);
        return [];
    }
}
function saveLikedRecipeToStore(id) {
    const foundRecipe = getRecipeFromStoreById(id);
    const storeResponse = localStorage.getItem("likedRecipes");
    if (storeResponse) {
        const likedRecipesArray = JSON.parse(storeResponse);
        likedRecipesArray.forEach((recipe) => {
            if (recipe._id !== id)
                foundRecipe.push(recipe);
        });
    }
    localStorage.setItem("likedRecipes", JSON.stringify(foundRecipe));
    generateLikedRecipesCards(foundRecipe);
}
function saveBookmarkedRecipeToStore(id) {
    const foundRecipe = getRecipeFromStoreById(id);
    const storeResponse = localStorage.getItem("bookmarkedRecipes");
    if (storeResponse) {
        const bookmarkedRecipesArray = JSON.parse(storeResponse);
        bookmarkedRecipesArray.forEach((recipe) => {
            if (recipe._id !== id)
                foundRecipe.push(recipe);
        });
    }
    localStorage.setItem("bookmarkedRecipes", JSON.stringify(foundRecipe));
    generateSavedRecipesCards(foundRecipe);
}
async function saveFavoritUserToStore(id) {
    const followedUserIdArray = [id.split("-")[1]];
    const storeResponse = localStorage.getItem("followedUsers");
    if (storeResponse) {
        const followedUsersArray = JSON.parse(storeResponse);
        followedUsersArray.forEach((user) => followedUserIdArray.push(user));
    }
    localStorage.setItem("followedUsers", JSON.stringify(followedUserIdArray));
    const recipesStore = localStorage.getItem("recipes");
    if (recipesStore) {
        populateFollowingSection(JSON.parse(recipesStore));
    }
}
function removeLikedRecipeFromStore(id) {
    const storeResponse = localStorage.getItem("likedRecipes");
    if (storeResponse) {
        const recipes = JSON.parse(storeResponse);
        const filterdRecipes = recipes.filter((recipe) => recipe._id !== id);
        localStorage.setItem("likedRecipes", JSON.stringify(filterdRecipes));
        generateLikedRecipesCards(filterdRecipes);
    }
}
function removeBookmarkedRecipeFromStore(id) {
    const storeResponse = localStorage.getItem("bookmarkedRecipes");
    if (storeResponse) {
        const recipes = JSON.parse(storeResponse);
        const filterdRecipes = recipes.filter((recipe) => recipe._id !== id);
        localStorage.setItem("bookmarkedRecipes", JSON.stringify(filterdRecipes));
        generateSavedRecipesCards(filterdRecipes);
    }
}
function removeFavoritUserToStore(id) {
    const storeResponse = localStorage.getItem("followedUsers");
    if (storeResponse) {
        const followedUsers = JSON.parse(storeResponse);
        const filterdFollowedUsers = followedUsers.filter((userId) => userId !== id.split("-")[1]);
        localStorage.setItem("followedUsers", JSON.stringify(filterdFollowedUsers));
        const recipesStore = localStorage.getItem("recipes");
        if (recipesStore) {
            populateFollowingSection(JSON.parse(recipesStore));
        }
    }
}
function changeLikedIcon() {
    const storeResponse = localStorage.getItem("likedRecipes");
    if (storeResponse) {
        const likedRecipesArray = JSON.parse(storeResponse);
        likedRecipesArray.forEach((recipe) => {
            const LikedIconRef = document.querySelectorAll(`#like-${recipe._id}`);
            if (LikedIconRef) {
                LikedIconRef.forEach((icon) => {
                    icon.src = "./assets/icons/icon-park-solid_like.svg";
                });
            }
        });
    }
}
function changeBookmarkedIcon() {
    const storeResponse = localStorage.getItem("bookmarkedRecipes");
    if (storeResponse) {
        const bookmarkedRecipesArray = JSON.parse(storeResponse);
        bookmarkedRecipesArray.forEach((recipe) => {
            const bookmarkedIconRef = document.querySelectorAll(`#bookmark-${recipe._id}`);
            if (bookmarkedIconRef) {
                bookmarkedIconRef.forEach((icon) => {
                    icon.src = "./assets/icons/material-symbols_bookmark.svg";
                });
            }
        });
    }
}
function changeFollowingIcon() {
    const storeResponse = localStorage.getItem("followedUsers");
    if (storeResponse) {
        const followedUsersArray = JSON.parse(storeResponse);
        followedUsersArray.forEach((userId) => {
            const followBtnRef = document.querySelectorAll(`#follow-${userId}`);
            if (followBtnRef) {
                followBtnRef.forEach((btn) => {
                    btn.classList.add("post__card-btn--active");
                    btn.textContent = "Following";
                });
            }
        });
    }
}
function onClickFunctionStartPagePostOptions(btnRef) {
    if (btnRef.textContent === "Popular") {
        if (!btnRef.classList.contains("start-page__nav-list-item--active")) {
            const nowActiveNav = document.querySelector(".start-page__nav-list-item--active");
            nowActiveNav.classList.remove("start-page__nav-list-item--active");
            btnRef.classList.add("start-page__nav-list-item--active");
            document.querySelector("#popularPostContainer")?.classList.remove("hidden");
            document.querySelector("#followingPostContainer")?.classList.add("hidden");
        }
    }
    else if (btnRef.textContent === "Following") {
        if (!btnRef.classList.contains("start-page__nav-list-item--active")) {
            const nowActiveNav = document.querySelector(".start-page__nav-list-item--active");
            nowActiveNav.classList.remove("start-page__nav-list-item--active");
            btnRef.classList.add("start-page__nav-list-item--active");
            document.querySelector("#popularPostContainer")?.classList.add("hidden");
            document.querySelector("#followingPostContainer")?.classList.remove("hidden");
        }
    }
}
function onClickNavigateFunction(navItemRef) {
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
function onClickFunctionFollowBtn(btnRef) {
    if (btnRef.classList.contains("post__card-btn--active")) {
        btnRef.classList.remove("post__card-btn--active");
        btnRef.textContent = "Follow";
        removeFavoritUserToStore(btnRef.id);
    }
    else {
        btnRef.classList.add("post__card-btn--active");
        btnRef.textContent = "Following";
        saveFavoritUserToStore(btnRef.id);
    }
}
async function onClickFunctionLike(btnRef) {
    const recipeId = btnRef.id.split("-")[1];
    const LikedIconRef = document.querySelectorAll(`#like-${recipeId}`);
    if (LikedIconRef) {
        LikedIconRef.forEach((icon) => {
            if (!icon.src.includes("outline")) {
                icon.src = "./assets/icons/icon-park-outline_like.svg";
                removeLikedRecipeFromStore(recipeId);
            }
            else {
                icon.src = "./assets/icons/icon-park-solid_like.svg";
                saveLikedRecipeToStore(recipeId);
            }
        });
    }
}
async function onClickFunctionComment(btnRef) {
    console.log("Comment", btnRef);
}
async function onClickFunctionShare(btnRef) {
    console.log("Share", btnRef);
}
async function onClickFunctionBookmark(btnRef) {
    const recipeId = btnRef.id.split("-")[1];
    const bookmarkIconRef = document.querySelectorAll(`#bookmark-${recipeId}`);
    if (bookmarkIconRef) {
        bookmarkIconRef.forEach((icon) => {
            if (!icon.src.includes("outline")) {
                icon.src = "./assets/icons/material-symbols_bookmark-outline.svg";
                removeBookmarkedRecipeFromStore(recipeId);
            }
            else {
                icon.src = "./assets/icons/material-symbols_bookmark.svg";
                saveBookmarkedRecipeToStore(recipeId);
            }
        });
    }
}
function openBookmarkCategory(btnRef) {
    switch (btnRef.id) {
        case "savedRecipes":
            document.querySelector("#bookmarkExpander")?.classList.toggle("expanded");
            document.querySelector("#savedChevron")?.classList.toggle("open");
            break;
        case "likedRecipes":
            document.querySelector("#likedExpander")?.classList.toggle("expanded");
            document.querySelector("#likedChevron")?.classList.toggle("open");
            break;
        case "createdRecipes":
            document.querySelector("#createdExpander")?.classList.toggle("expanded");
            document.querySelector("#createdChevron")?.classList.toggle("open");
            break;
    }
}
function populateFollowingSection(recipes) {
    const storeResponse = localStorage.getItem("followedUsers");
    const mainSection = document.querySelector(`#followingPostContainer`);
    mainSection.innerHTML = "";
    if (storeResponse) {
        const followedUsersArray = JSON.parse(storeResponse);
        followedUsersArray.forEach((userId) => {
            const foundRecipe = recipes.find((recipe) => recipe.createdBy._id === userId);
            generatePostCard(foundRecipe, "followingPostContainer");
        });
        changeLikedIcon();
        changeBookmarkedIcon();
        changeFollowingIcon();
    }
}
function generatePostCard(recipe, sectionId) {
    const newPostEle = document.createElement("article");
    newPostEle.classList.add("post__card");
    const cardHeaderEle = generateCardHeader(recipe.createdBy);
    newPostEle.appendChild(cardHeaderEle);
    const imageEle = generateCardImages(recipe);
    newPostEle.appendChild(imageEle);
    const cardInformationEle = generateCardInformation(recipe);
    newPostEle.appendChild(cardInformationEle);
    const interactionEle = generateCardInteraction(recipe);
    newPostEle.appendChild(interactionEle);
    const commentEle = generateCardComments(recipe);
    newPostEle.appendChild(commentEle);
    document.querySelector(`#${sectionId}`)?.appendChild(newPostEle);
}
function generateCardHeader(createdBy) {
    const cardHeaderEle = document.createElement("section");
    cardHeaderEle.classList.add("post__card-header");
    const cardAvatarEle = document.createElement("img");
    cardAvatarEle.src = createdBy.profilePictureUrl;
    cardAvatarEle.alt = `${createdBy.username}s avatar`;
    cardAvatarEle.classList.add("post__card-avatar");
    cardHeaderEle.appendChild(cardAvatarEle);
    const cardUploaderEle = document.createElement("span");
    cardUploaderEle.classList.add("post__card-poster");
    const cardUsernameEle = document.createElement("h3");
    cardUsernameEle.textContent = createdBy.username;
    const cardExperienceEle = document.createElement("p");
    cardExperienceEle.textContent = createdBy.experienceLevel;
    cardUploaderEle.appendChild(cardUsernameEle);
    cardUploaderEle.appendChild(cardExperienceEle);
    cardHeaderEle.appendChild(cardUploaderEle);
    const cardFollowBtnEle = document.createElement("button");
    cardFollowBtnEle.classList.add("post__card-btn");
    cardFollowBtnEle.textContent = "Follow";
    cardFollowBtnEle.id = `follow-${createdBy._id}`;
    cardFollowBtnEle.addEventListener("click", () => onClickFunctionFollowBtn(cardFollowBtnEle));
    cardHeaderEle.appendChild(cardFollowBtnEle);
    return cardHeaderEle;
}
function generateCardImages(recipe) {
    const cardImagesContainerEle = document.createElement("figure");
    cardImagesContainerEle.classList.add("post__card-images");
    recipe.imageUrl.forEach((url) => {
        const cardImageEle = document.createElement("img");
        cardImageEle.src = url;
        cardImageEle.alt = `Image of ${recipe.title}`;
        cardImagesContainerEle.appendChild(cardImageEle);
    });
    const cardTagsEle = document.createElement("section");
    cardTagsEle.classList.add("post__card-tags");
    recipe.tags.forEach((tag) => {
        const tagsElse = generateRecipeTags(tag);
        cardTagsEle.appendChild(tagsElse);
    });
    cardImagesContainerEle.appendChild(cardTagsEle);
    return cardImagesContainerEle;
}
function generateCardInformation(recipe) {
    const newPostEle = document.createElement("section");
    newPostEle.classList.add("post__card-information");
    const newTitleEle = document.createElement("h3");
    newTitleEle.textContent = recipe.title;
    newPostEle.appendChild(newTitleEle);
    const newDateEle = document.createElement("p");
    newDateEle.textContent = `${recipe.createdAt.toString().split("T")[0]}`;
    console.log(new Date(recipe.createdAt));
    newPostEle.appendChild(newDateEle);
    return newPostEle;
}
function generateCardInteraction(recipe) {
    const cardInteractionsEle = document.createElement("section");
    cardInteractionsEle.classList.add("post__card-interaction");
    const interactionIcons = [
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
        const interactionIconEle = document.createElement("img");
        interactionIconEle.src = icon.url;
        interactionIconEle.alt = `${recipe._id} ${icon.type} icon`;
        interactionIconEle.id = `${icon.type}-${recipe._id}`;
        interactionIconEle.classList.add(`post__interaction-icon`);
        interactionIconEle.addEventListener("click", () => icon.onClick(interactionIconEle));
        cardInteractionsEle.appendChild(interactionIconEle);
    });
    return cardInteractionsEle;
}
function generateCardComments(recipe) {
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
    const cardCommentsEle = document.createElement("section");
    cardCommentsEle.classList.add("post__card-comment");
    recipe.comments.forEach((comment) => {
        const avatarEle = document.createElement("img");
        avatarEle.classList.add("post__card-avatar");
        avatarEle.src = comment.createdBy.profilePictureUrl;
        avatarEle.alt = `${comment.createdBy.username}'s avatar`;
        cardCommentsEle.appendChild(avatarEle);
        const spanEle = document.createElement("span");
        const h3Ele = document.createElement("h3");
        h3Ele.textContent = comment.createdBy.username;
        spanEle.appendChild(h3Ele);
        cardCommentsEle.appendChild(spanEle);
        const commentPEle = document.createElement("p");
        commentPEle.textContent = comment.content;
        cardCommentsEle.appendChild(commentPEle);
    });
    return cardCommentsEle;
}
function populateBookmarkPage(recipes) {
    generateCreatedRecipesCards(recipes);
    const bookmarkedStoreResponse = localStorage.getItem("bookmarkedRecipes");
    if (bookmarkedStoreResponse) {
        const bookmarkedRecipesArray = JSON.parse(bookmarkedStoreResponse);
        const savedRecipes = bookmarkedRecipesArray ? bookmarkedRecipesArray : [];
        generateSavedRecipesCards(savedRecipes);
    }
    const likedStoreResponse = localStorage.getItem("likedRecipes");
    if (likedStoreResponse) {
        const likedRecipesArray = JSON.parse(likedStoreResponse);
        const likedRecipes = likedRecipesArray ? likedRecipesArray : [];
        generateLikedRecipesCards(likedRecipes);
    }
}
function generateCreatedRecipesCards(recipes) {
    const bookmarkCreatedEle = document.querySelector("#bookmarkCreated");
    const profileBookmarkEle = document.querySelector("#profileBookmarkCreated");
    recipes.forEach((recipe) => {
        if (recipe.createdBy.username === "Flavorly") {
            const generatedCard = generateBookmarkCard(recipe);
            bookmarkCreatedEle?.appendChild(generatedCard);
            const smallGeneratedCard = generateSmallBookmarkCard(recipe);
            profileBookmarkEle?.appendChild(smallGeneratedCard);
        }
    });
}
function generateSavedRecipesCards(recipes) {
    const bookmarkSavedEle = document.querySelector("#bookmarkSaved");
    const profileBookmarkEle = document.querySelector("#profileBookmarkSaved");
    bookmarkSavedEle.innerHTML = "";
    profileBookmarkEle.innerHTML = "";
    recipes.forEach((recipe) => {
        const generatedCard = generateBookmarkCard(recipe);
        bookmarkSavedEle?.appendChild(generatedCard);
        const smallGeneratedCard = generateSmallBookmarkCard(recipe);
        profileBookmarkEle?.appendChild(smallGeneratedCard);
    });
}
function generateLikedRecipesCards(recipes) {
    const bookmarkLikedEle = document.querySelector("#bookmarkLiked");
    const profileBookmarkEle = document.querySelector("#profileBookmarkLiked");
    bookmarkLikedEle.innerHTML = "";
    profileBookmarkEle.innerHTML = "";
    recipes.forEach((recipe) => {
        const generatedCard = generateBookmarkCard(recipe);
        bookmarkLikedEle?.appendChild(generatedCard);
        const smallGeneratedCard = generateSmallBookmarkCard(recipe);
        profileBookmarkEle?.appendChild(smallGeneratedCard);
    });
}
function generateBookmarkCard(recipe) {
    const listEle = document.createElement("li");
    listEle.classList.add("bookmark__list-item");
    const articleEle = document.createElement("article");
    articleEle.classList.add("bookmark__recipe-card");
    const figureEle = generateBookmarkImage(recipe);
    articleEle.appendChild(figureEle);
    const bookmarkText = generateBookmarkCardTitle(recipe);
    articleEle.appendChild(bookmarkText);
    listEle.appendChild(articleEle);
    return listEle;
}
function generateBookmarkCardTitle(recipe) {
    const sectionEle = document.createElement("section");
    sectionEle.classList.add("recipe-card__information-container");
    const h2Ele = document.createElement("h2");
    h2Ele.textContent = recipe.title;
    sectionEle.appendChild(h2Ele);
    const tagSectionEle = document.createElement("section");
    tagSectionEle.classList.add("post__search-tags");
    recipe.tags.forEach((tag) => {
        const tagEle = generateRecipeTags(tag);
        tagSectionEle.appendChild(tagEle);
    });
    sectionEle.appendChild(tagSectionEle);
    const pEle = document.createElement("p");
    pEle.textContent = recipe.description;
    sectionEle.appendChild(pEle);
    return sectionEle;
}
function generateBookmarkImage(recipe) {
    const figureEle = document.createElement("figure");
    figureEle.classList.add("recipe-card__image-container");
    const imgEle = document.createElement("img");
    imgEle.src = recipe.imageUrl[0];
    imgEle.alt = `${recipe.title} plate`;
    figureEle.appendChild(imgEle);
    return figureEle;
}
function generateSmallBookmarkCard(recipe) {
    const articleEle = document.createElement("article");
    articleEle.classList.add("profile-page__recipes-card");
    const imgEle = document.createElement("img");
    imgEle.src = recipe.imageUrl[0];
    imgEle.alt = `${recipe.title} plate`;
    articleEle.appendChild(imgEle);
    const h3Ele = document.createElement("h3");
    h3Ele.textContent = recipe.title;
    articleEle.appendChild(h3Ele);
    return articleEle;
}
function generateRecipeTags(tag) {
    const cardTagEle = document.createElement("p");
    cardTagEle.textContent = tag;
    return cardTagEle;
}
function NavigateToHomePage() {
    document.querySelector(".start-page")?.classList.remove("hidden");
    document.querySelector(".search-page")?.classList.add("hidden");
    document.querySelector(".add-page")?.classList.add("hidden");
    document.querySelector(".bookmark-page")?.classList.add("hidden");
    document.querySelector(".profile-page")?.classList.add("hidden");
}
function NavigateToSearchPage() {
    document.querySelector(".start-page")?.classList.add("hidden");
    document.querySelector(".search-page")?.classList.remove("hidden");
    document.querySelector(".add-page")?.classList.add("hidden");
    document.querySelector(".bookmark-page")?.classList.add("hidden");
    document.querySelector(".profile-page")?.classList.add("hidden");
}
function NavigateToAddPage() {
    document.querySelector(".start-page")?.classList.add("hidden");
    document.querySelector(".search-page")?.classList.add("hidden");
    document.querySelector(".add-page")?.classList.remove("hidden");
    document.querySelector(".bookmark-page")?.classList.add("hidden");
    document.querySelector(".profile-page")?.classList.add("hidden");
}
function NavigateToBookmarkPage() {
    document.querySelector(".start-page")?.classList.add("hidden");
    document.querySelector(".search-page")?.classList.add("hidden");
    document.querySelector(".add-page")?.classList.add("hidden");
    document.querySelector(".bookmark-page")?.classList.remove("hidden");
    document.querySelector(".profile-page")?.classList.add("hidden");
}
function NavigateToProfilePage() {
    document.querySelector(".start-page")?.classList.add("hidden");
    document.querySelector(".search-page")?.classList.add("hidden");
    document.querySelector(".add-page")?.classList.add("hidden");
    document.querySelector(".bookmark-page")?.classList.add("hidden");
    document.querySelector(".profile-page")?.classList.remove("hidden");
}
