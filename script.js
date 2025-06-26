const apiKey = '63964882c83844d19f7b3f56b96a1b9a'; // Replace if expired

document.getElementById("searchBtn").addEventListener("click", getRecipes);

async function getRecipes() {
  const ingredient = document.getElementById("ingredient").value.trim();
  const count = document.getElementById("recipeCount").value;
  const vegetarianOnly = document.getElementById("vegetarianOnly").checked;
  const recipesContainer = document.getElementById("recipes");

  if (!ingredient) {
    alert("Please enter ingredients!");
    return;
  }

  const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredient}&number=${count}&apiKey=${apiKey}`;

  recipesContainer.innerHTML = '<p class="text-gray-500 animate-pulse">Loading recipes...</p>';

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      recipesContainer.innerHTML = '<p class="text-red-500">No recipes found. Try different ingredients.</p>';
      return;
    }

    let recipes = data;

    if (vegetarianOnly) {
      recipes = recipes.filter(recipe =>
        recipe.usedIngredients.some(ing => ing.name.toLowerCase().includes("vegetable")) ||
        recipe.title.toLowerCase().includes("vegetarian")
      );
    }

    displayRecipes(recipes);
  } catch (error) {
    console.error('Error:', error);
    recipesContainer.innerHTML = '<p class="text-red-500">Error fetching recipes. Try again later.</p>';
  }
}

function displayRecipes(recipes) {
  const recipesContainer = document.getElementById("recipes");
  recipesContainer.innerHTML = '';

  recipes.forEach(recipe => {
    const recipeCard = document.createElement("div");
    recipeCard.className = "bg-white p-6 rounded-xl shadow hover:shadow-xl hover:scale-105 transition-transform duration-200";

    const used = recipe.usedIngredients.map(i => i.name).join(", ");
    const missed = recipe.missedIngredients.map(i => i.name).join(", ");

    recipeCard.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}" class="w-full h-48 object-cover rounded-lg mb-4">
      <h3 class="text-xl font-semibold text-gray-800 mb-2">${recipe.title}</h3>
      <p class="text-sm text-gray-600 mb-1">Used: ${used || "N/A"}</p>
      <p class="text-sm text-gray-600 mb-2">Missing: ${missed || "None"}</p>
      <a href="https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, "-")}-${recipe.id}" target="_blank" class="text-green-600 hover:text-green-500 text-sm font-semibold">View Recipe</a>
      <br>
      <button onclick="addToFavorites(${recipe.id}, '${recipe.title.replace(/'/g, "\\'")}', '${recipe.image}')" class="mt-2 text-blue-600 hover:text-blue-500 text-sm">Add to Favorites</button>
    `;

    recipesContainer.appendChild(recipeCard);
  });
}

function addToFavorites(id, title, image) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const exists = favorites.find(recipe => recipe.id === id);
  if (exists) {
    alert("Already in favorites!");
    return;
  }
  favorites.push({ id, title, image });
  localStorage.setItem("favorites", JSON.stringify(favorites));
  alert("Added to favorites!");
}
