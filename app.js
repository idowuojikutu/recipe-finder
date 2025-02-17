document.getElementById("searchBtn").addEventListener("click", getRecipes);

async function getRecipes() {
    const ingredient = document.getElementById("ingredient").value;
    if (!ingredient) {
        alert("Please enter ingredients!");
        return;
    }

    const apiKey = 'https://api.spoonacular.com/food/customFoods/add'; // Replace with your Spoonacular API key
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredient}&number=5&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        POST 
        displayRecipes(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        alert("Failed to fetch recipes.");
    }
}

function displayRecipes(recipes) {
    const recipesContainer = document.getElementById("recipes");
    recipesContainer.innerHTML = ''; // Clear previous results

    if (recipes.length === 0) {
        recipesContainer.innerHTML = '<p class="text-gray-500">No recipes found. Try different ingredients.</p>';
        return;
    }

    recipes.forEach(recipe => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("bg-white", "p-6", "rounded-lg", "shadow-lg", "hover:shadow-xl", "transition");

        recipeCard.innerHTML = `
            <img src="https://spoonacular.com/recipeImages/${recipe.id}-480x360.jpg" alt="${recipe.title}" class="w-full h-48 object-cover rounded-lg mb-4">
            <h3 class="text-xl font-semibold text-gray-800 mb-2">${recipe.title}</h3>
            <p class="text-sm text-gray-600 mb-4">Ingredients: ${recipe.usedIngredients.map(item => item.name).join(', ')}</p>
            <a href="https://spoonacular.com/recipes/${recipe.title}-${recipe.id}" target="_blank" class="text-green-500 hover:text-green-400 font-semibold">View Recipe</a>
        `;

        recipesContainer.appendChild(recipeCard);
    });
}
