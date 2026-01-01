const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Read recipes from file
const getRecipes = () => {
  const data = fs.readFileSync("recipes.json");
  return JSON.parse(data);
};

// Save recipes to file
const saveRecipes = (recipes) => {
  fs.writeFileSync("recipes.json", JSON.stringify(recipes, null, 2));
};

// GET all recipes
app.get("/recipes", (req, res) => {
  const recipes = getRecipes();
  res.json(recipes);
});

// POST a new recipe
app.post("/recipes", (req, res) => {
  const recipes = getRecipes();

  const newRecipe = {
    id: Date.now(),
    title: req.body.title,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions
  };

  recipes.push(newRecipe);
  saveRecipes(recipes);

  res.status(201).json(newRecipe);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
