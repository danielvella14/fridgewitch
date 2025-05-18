import fetch from 'node-fetch';

export default async function handler(req, res) {
  const SPOON_KEY = process.env.SPOON_KEY;
  const { ingredients = "", surprise, preference = "either", diet = "none", strict } = req.query;

  const pantryStaples = [
    "salt", "pepper", "olive oil", "vegetable oil", "butter", "flour", "sugar", "baking powder",
    "baking soda", "garlic", "onion", "eggs", "milk", "water", "vinegar", "soy sauce", "mustard",
    "ketchup", "mayonnaise", "honey", "spices", "herbs", "yeast", "cornstarch", "lemon", "lime",
    "tomato paste", "parmesan", "cheddar", "cream", "cream cheese", "breadcrumbs", "stock", "bouillon"
  ];

  const majorProteins = ["chicken", "beef", "pork", "salmon", "tuna", "lamb", "duck", "turkey", "ham", "bacon", "shrimp"];

  function isSimilar(ingredient, list) {
    return list.some(item =>
      ingredient.includes(item) || item.includes(ingredient)
    );
  }

  async function urlIsValid(url) {
    try {
      const head = await fetch(url, { method: 'HEAD' });
      return head.ok;
    } catch {
      return false;
    }
  }

  try {
    let recipes = [];

    if (surprise === "true") {
      const r = await fetch(`https://api.spoonacular.com/recipes/random?number=15&apiKey=${SPOON_KEY}`);
      const data = await r.json();
      recipes = data.recipes;
    } else {
      const r = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(ingredients)}&fillIngredients=true&addRecipeInformation=true&number=25&ignorePantry=false&ranking=2&apiKey=${SPOON_KEY}`
      );
      const data = await r.json();
      recipes = data.results;
    }

    const userInputs = ingredients.toLowerCase().split(",").map(i => i.trim());

    let filtered = recipes.filter(recipe => {
      if (!recipe.extendedIngredients || !recipe.sourceUrl) return false;

      const allIngredients = recipe.extendedIngredients.map(ing => ing.name.toLowerCase());

      for (let protein of majorProteins) {
        const recipeHasProtein = allIngredients.some(ing => ing.includes(protein));
        const userMentionedProtein = userInputs.some(input => input.includes(protein));
        if (recipeHasProtein && !userMentionedProtein) {
          return false;
        }
      }

      const extras = allIngredients.filter(ing =>
        !isSimilar(ing, userInputs) && !isSimilar(ing, pantryStaples)
      );

      const extraLimit = strict === "true" ? 0 : 5;
      return extras.length <= extraLimit;
    });

    // Filter only recipes that have valid source URLs
    const validated = [];
    for (let recipe of filtered) {
      if (recipe.sourceUrl && await urlIsValid(recipe.sourceUrl)) {
        validated.push(recipe);
      }
      if (validated.length >= 8) break;
    }

    if (validated.length === 0 && recipes.length > 0) {
      res.status(200).json([]);
    } else {
      res.status(200).json(validated);
    }

  } catch (err) {
    console.error("Witch API error:", err);
    res.status(500).json({ error: "Something went wrong with the spell" });
  }
}
