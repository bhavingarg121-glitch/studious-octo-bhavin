/public
  └── app.js        (FRONTEND – runs in browser)
server.js           (BACKEND – runs in Node.js)
recipes.json
const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const getRecipes = () => {
  const data = fs.readFileSync("recipes.json");
  return JSON.parse(data);
};

const saveRecipes = (recipes) => {
  fs.writeFileSync("recipes.json", JSON.stringify(recipes, null, 2));
};

app.get("/recipes", (req, res) => {
  const recipes = getRecipes();
  res.json(recipes);
});

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
/* Initial render */
populateCategoryFilter();
renderCurrent();
const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const RECIPES_FILE = "recipes.json";

// Read recipes
const getRecipes = () => {
  if (!fs.existsSync(RECIPES_FILE)) {
    fs.writeFileSync(RECIPES_FILE, JSON.stringify([]));
  }
  const data = fs.readFileSync(RECIPES_FILE, "utf-8");
  return JSON.parse(data);
};

// Save recipes
const saveRecipes = (recipes) => {
  fs.writeFileSync(RECIPES_FILE, JSON.stringify(recipes, null, 2));
};

// GET
app.get("/recipes", (req, res) => {
  res.json(getRecipes());
});

// POST
app.post("/recipes", (req, res) => {
  const recipes = getRecipes();
  const newRecipe = {
    id: `r${Date.now()}`,
    title: req.body.title,
    category: req.body.category || "Uncategorized",
    image: req.body.image || "",
    ingredients: req.body.ingredients || [],
    instructions: req.body.instructions || ""
  };
  recipes.push(newRecipe);
  saveRecipes(recipes);
  res.status(201).json(newRecipe);
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
if (!newR.title) {
  alert("Recipe title is required");
  return;
}
image: encodeURI((fd.get("image")||"").trim()),
npm init -y
npm install express cors
// server.js
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public')); // serve your frontend files
app.use(express.json());

// Mock database or real one (MongoDB, etc.)
const imageData = {
  "1": {
    title: "Sunset Beach",
    fullUrl: "/images/full/photo1-full.jpg",
    description: "Beautiful sunset captured in 2025.",
    menuItems: ["Download", "Share", "Edit", "Delete"] // if you want full menu
  },
  "2": { /* ... */ }
};

app.get('/api/image/:id', (req, res) => {
  const id = req.params.id;
  const data = imageData[id];

  if (!data) {
    return res.status(404).json({ error: "Image not found" });
  }

  res.json(data); // This feeds the modal/menu with animations on frontend
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

