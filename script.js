// Simple recipe UI with search, filter, modal, favorites, and add form.
// Data persistence: localStorage under "recipes_v1" and "favorites_v1".

const DEFAULT_RECIPES = [
  {
    id: "r1",
    title: "Classic Pancakes",
    category: "Breakfast",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6e0b?q=80&w=1200&auto=format&fit=crop&crop=entropy",
    ingredients: ["1 1/2 cups flour", "3 1/2 tsp baking powder", "1 egg", "1 1/4 cups milk", "3 tbsp butter, melted"],
    instructions: "Mix dry ingredients. Whisk egg and milk and melted butter. Combine until smooth. Cook on a hot griddle 2-3 minutes per side."
  },
  {
    id: "r2",
    title: "Simple Tomato Pasta",
    category: "Dinner",
    image: "https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?q=80&w=1200&auto=format&fit=crop&crop=entropy",
    ingredients: ["200g pasta", "2 cups crushed tomatoes", "2 cloves garlic", "Olive oil", "Salt & pepper", "Basil"],
    instructions: "Cook pasta. Sauté garlic in olive oil, add tomatoes and simmer. Toss with pasta, top with basil."
  },
  {
    id: "r3",
    title: "Chocolate Chip Cookies",
    category: "Dessert",
    image: "https://images.unsplash.com/photo-1599785209707-6f8f4a8b1e2b?q=80&w=1200&auto=format&fit=crop&crop=entropy",
    ingredients: ["2 1/4 cups flour", "1 tsp baking soda", "1 cup butter", "3/4 cup sugar", "3/4 cup brown sugar", "2 eggs", "2 cups chocolate chips"],
    instructions: "Cream butter and sugars. Add eggs. Mix dry ingredients and combine. Fold in chips. Bake at 375°F for 9-11 minutes."
  }
];

const LS_RECIPES = "recipes_v1";
const LS_FAVORITES = "favorites_v1";

const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

let recipes = loadRecipes();
let favorites = loadFavorites();

const recipeGrid = $("#recipeGrid");
const searchInput = $("#searchInput");
const categoryFilter = $("#categoryFilter");
const addRecipeBtn = $("#addRecipeBtn");
const recipeModal = $("#recipeModal");
const modalBody = $("#modalBody");
const closeModalBtn = $("#closeModalBtn");
const addModal = $("#addModal");
const closeAddModalBtn = $("#closeAddModalBtn");
const addRecipeForm = $("#addRecipeForm");
const cancelAddBtn = $("#cancelAddBtn");

function loadRecipes(){
  try{
    const raw = localStorage.getItem(LS_RECIPES);
    if(raw) return JSON.parse(raw);
  }catch(e){}
  localStorage.setItem(LS_RECIPES, JSON.stringify(DEFAULT_RECIPES));
  return JSON.parse(localStorage.getItem(LS_RECIPES));
}

function saveRecipes(){
  localStorage.setItem(LS_RECIPES, JSON.stringify(recipes));
}

function loadFavorites(){
  try{
    const raw = localStorage.getItem(LS_FAVORITES);
    if(raw) return JSON.parse(raw);
  }catch(e){}
  return {};
}

function saveFavorites(){
  localStorage.setItem(LS_FAVORITES, JSON.stringify(favorites));
}

function uniqueCategories(){
  const set = new Set(recipes.map(r => r.category || "uncategorized"));
  return Array.from(set).sort();
}

function populateCategoryFilter(){
  const current = categoryFilter.value || "";
  categoryFilter.innerHTML = `<option value="">All categories</option>`;
  uniqueCategories().forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
  if(current) categoryFilter.value = current;
}

function renderRecipes(list = recipes){
  recipeGrid.innerHTML = "";
  if(list.length === 0){
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.innerHTML = `<p>No recipes found. Try a broader search or add a new recipe.</p>`;
    recipeGrid.appendChild(empty);
    return;
  }
  for(const r of list){
    recipeGrid.appendChild(createCard(r));
  }
}

function createCard(recipe){
  const card = document.createElement("article");
  card.className = "card";
  const thumb = document.createElement("div");
  thumb.className = "thumb";
  thumb.style.backgroundImage = `url(${recipe.image || placeholderImage(recipe.title)})`;
  const body = document.createElement("div");
  body.className = "body";
  const title = document.createElement("h3");
  title.textContent = recipe.title;
  const meta = document.createElement("div");
  meta.className = "meta";
  meta.textContent = recipe.category || "uncategorized";
  const actions = document.createElement("div");
  actions.className = "actions";
  const viewBtn = document.createElement("button");
  viewBtn.className = "btn";
  viewBtn.textContent = "View";
  viewBtn.addEventListener("click", () => openRecipeModal(recipe.id));
  const likeBtn = document.createElement("button");
  likeBtn.className = "like-btn";
  likeBtn.innerHTML = favorites[recipe.id] ? "♥ Favorited" : "♡ Favorite";
  likeBtn.addEventListener("click", () => {
    if(favorites[recipe.id]) delete favorites[recipe.id];
    else favorites[recipe.id] = true;
    saveFavorites();
    likeBtn.innerHTML = favorites[recipe.id] ? "♥ Favorited" : "♡ Favorite";
  });
  actions.appendChild(viewBtn);
  actions.appendChild(likeBtn);

  body.appendChild(title);
  body.appendChild(meta);
  body.appendChild(actions);

  card.appendChild(thumb);
  card.appendChild(body);
  return card;
}

function placeholderImage(text){
  return `https://source.unsplash.com/collection/1163637/600x400/?sig=${encodeURIComponent(text)}`;
}

function openRecipeModal(id){
  const recipe = recipes.find(r => r.id === id);
  if(!recipe) return;
  recipeModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  modalBody.innerHTML = `
    <div class="modal-body-grid">
      <div>
        <div style="height:260px;border-radius:10px;background-image:url(${recipe.image || placeholderImage(recipe.title)});background-size:cover;background-position:center;margin-bottom:12px"></div>
        <h2>${escapeHtml(recipe.title)}</h2>
        <div class="meta">${escapeHtml(recipe.category || "Uncategorized")}</div>
        <h3>Ingredients</h3>
        <ul>${(recipe.ingredients||[]).map(i => `<li>${escapeHtml(i)}</li>`).join("")}</ul>
        <h3>Instructions</h3>
        <p style="white-space:pre-line">${escapeHtml(recipe.instructions)}</p>
      </div>
      <aside>
        <div style="padding:8px;border-left:1px solid #f0f0f0">
          <p><strong>Actions</strong></p>
          <button id="openInNew" class="btn">Open in new tab</button>
          <button id="toggleFav" class="btn" style="margin-top:8px">${favorites[id] ? "Remove Favorite" : "Add Favorite"}</button>
        </div>
      </aside>
    </div>
  `;
  $("#openInNew").addEventListener("click", () => {
    const win = window.open("", "_blank");
    win.document.write(`<pre>${escapeHtml(JSON.stringify(recipe, null, 2))}</pre>`);
    win.document.title = recipe.title;
  });
  $("#toggleFav").addEventListener("click", () => {
    if(favorites[id]) delete favorites[id];
    else favorites[id]=true;
    saveFavorites();
    $("#toggleFav").textContent = favorites[id] ? "Remove Favorite" : "Add Favorite";
    renderCurrent();
  });
}

function closeRecipeModal(){
  recipeModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  modalBody.innerHTML = "";
}

function openAddModal(){
  addModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeAddModal(){
  addModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  addRecipeForm.reset();
}

function escapeHtml(s){
  return String(s || "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
}

/* Search and filter */
function renderCurrent(){
  const q = (searchInput.value || "").trim().toLowerCase();
  const cat = categoryFilter.value || "";
  const filtered = recipes.filter(r => {
    if(cat && (r.category || "") !== cat) return false;
    if(!q) return true;
    const hay = `${r.title} ${(r.ingredients||[]).join(" ")} ${r.category}`.toLowerCase();
    return hay.includes(q);
  });
  renderRecipes(filtered);
  populateCategoryFilter();
}

searchInput.addEventListener("input", () => renderCurrent());
categoryFilter.addEventListener("change", () => renderCurrent());

/* Modal event listeners */
closeModalBtn.addEventListener("click", closeRecipeModal);
recipeModal.addEventListener("click", (e)=>{
  if(e.target === recipeModal) closeRecipeModal();
});
document.addEventListener("keydown", (e) => {
  if(e.key === "Escape"){
    if(recipeModal.getAttribute("aria-hidden")==="false") closeRecipeModal();
    if(addModal.getAttribute("aria-hidden")==="false") closeAddModal();
  }
});

/* Add recipe form */
addRecipeBtn.addEventListener("click", openAddModal);
closeAddModalBtn.addEventListener("click", closeAddModal);
cancelAddBtn.addEventListener("click", closeAddModal);
addModal.addEventListener("click", (e)=>{ if(e.target === addModal) closeAddModal(); });

addRecipeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(addRecipeForm);
  const newR = {
    id: `r${Date.now()}`,
    title: (fd.get("title")||"").trim(),
    category: (fd.get("category")||"").trim() || "Uncategorized",
    image: (fd.get("image")||"").trim(),
    ingredients: (fd.get("ingredients")||"").split("\n").map(s => s.trim()).filter(Boolean),
    instructions: (fd.get("instructions")||"").trim()
  };
  recipes.unshift(newR);
  saveRecipes();
  closeAddModal();
  renderCurrent();
});

/* Initial render */
populateCategoryFilter();
renderCurrent();
