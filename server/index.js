import express from "express";
import nedb from "nedb-promises";
import cors from "cors";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

const database = new nedb({ filename: "./data/recipes.db", autoload: true });

app.get("/api/recipe/top", async (req, res) => {
    const allRecipes = await database.find({});
    res.status(200).send({
        success: true,
        recipes: allRecipes,
    });
});

app.get("/api/recipe/:id", async (req, res) => {
    const id = req.params.id;
    const allRecipes = await database.find({ _id: id });
    res.status(200).send({
        success: true,
        recipes: allRecipes,
    });
});

app.post("/api/recipe/create", (req, res) => {
    const { title, description, tags, ingredients, instructions, imageUrl, createdBy } = req.body;
    const newRecipe = {
        title,
        description,
        tags,
        ingredients,
        instructions,
        imageUrl,
        createdBy,
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: [],
        comments: [],
    };
    database.insert(newRecipe);
    res.send("created new");
});

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
