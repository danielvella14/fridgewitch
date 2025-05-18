export default async function handler(req, res) {
  const SPOON_KEY = process.env.SPOON_KEY;
  const { ingredients = "", surprise, preference = "either", diet = "none", strict } = req.query;

  const pantryStaples = [
    "salt", "pepper", "olive oil", "vegetable oil", "butter", "flour", "sugar", "baking powder",
    "baking soda", "garlic", "onion", "eggs", "milk", "water", "vinegar", "soy sauce", "mustard",
    "ketchup", "mayonnaise", "honey", "spices", "herbs", "yeast", "cornstarch", "lemon", "lime",
    "tomato paste", "parmesan", "cheddar", "cream", "cream cheese", "breadcrumbs", "stock", "bouillon"
  ];

  function isSimilar(ingredient, list) {
    return list.some(item => ingredient.includes(item) || item.includes(ingredient));
  }

  try {
    let recipes = [];

    if (surprise === "true") {
      const r = await fetch(`https://api.spoonacular.com/recipes/random?number=12&apiKey=${SPOON_KEY}`);
      const data = await r.json();
      recipes = data.recipes;
    } else {
      const r = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(ingredients)}&fillIngredients=true&addRecipeInformation=true&number=20&ignorePantry=false&ranking=2&apiKey=${SPOON_KEY}`
      );
      const data = await r.json();
      recipes = data.results;
    }

    const userInputs = ingredients.toLowerCase().split(",").map(i => i.trim());

    let filtered = recipes.filter(recipe => {
      if (!recipe.extendedIngredients) return false;

      const allIngredients = recipe.extendedIngredients.map(ing => ing.name.toLowerCase());
      const extras = allIngredients.filter(ing =>
        !isSimilar(ing, userInputs) && !isSimilar(ing, pantryStaples)
      );

      const extraLimit = strict === "true" ? 0 : 5;
      return extras.length <= extraLimit;
    });

    if (preference === "sweet") {
      filtered = filtered.filter(r =>
        r.dishTypes.some(type => ["dessert", "snack", "drink"].includes(type.toLowerCase())) ||
        /dessert|cake|cookie|sweet|pudding|brûlée|muffin|truffle|ice cream/i.test(r.title)
      );
    } else if (preference === "savory") {
      filtered = filtered.filter(r =>
        r.dishTypes.some(type => ["main course", "side dish", "lunch", "dinner", "salad", "soup"].includes(type.toLowerCase())) &&
        !/dessert|cake|cookie|sweet|pudding|brûlée|muffin|truffle|ice cream/i.test(r.title)
      );
    }

    if (diet === "vegetarian") filtered = filtered.filter(r => r.vegetarian);
    if (diet === "gluten free") filtered = filtered.filter(r => r.glutenFree);

    if (filtered.length === 0 && recipes.length > 0) {
      filtered = recipes.slice(0, 3);
    }

    res.status(200).json(filtered.slice(0, 8));
  } catch (err) {
    console.error("Witch API error:", err);
    res.status(500).json({ error: "Something went wrong with the spell" });
  }
}
