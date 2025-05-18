function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function showSpellSteps(steps) {
  const spellDiv = document.getElementById("spellSteps");
  spellDiv.innerHTML = "";

  for (let i = 0; i < steps.length; i++) {
    const step = document.createElement("div");
    step.className = "spell-step";
    step.style.animationDelay = `${i * 1}s`;
    step.textContent = steps[i];
    spellDiv.appendChild(step);
    await wait(1000);
  }
}

function sanitize(text) {
  return text
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function createRecipeCard(recipe) {
  const title = recipe.title;
  const image = recipe.image;
  const summary = recipe.summary ? sanitize(recipe.summary) : "No summary available.";
  const instructions = recipe.instructions ? sanitize(recipe.instructions) : "No instructions provided.";

  return `
    <div class="recipe-card">
      <h3>${title}</h3>
      <img src="${image}" alt="${title}" />
      <p><strong>Summary:</strong> ${summary}</p>
      <p><strong>Instructions:</strong> ${instructions}</p>
    </div>
  `;
}

async function fetchAndDisplayRecipes(url, resultsDiv, loadingDiv) {
  loadingDiv.hidden = false;
  resultsDiv.innerHTML = "";

  await showSpellSteps([
    "Consulting the pantry spirits...",
    "Grinding garlic dust...",
    "Translating forbidden recipes...",
    "Whisking quantum eggs...",
    "Summoning complete!"
  ]);

  try {
    const res = await fetch(url);
    const data = await res.json();

    loadingDiv.hidden = true;

    const validRecipes = data.filter(r => r.title && r.image);

    if (!validRecipes.length) {
      resultsDiv.innerHTML = "No recipes found. The fridge spirits are puzzled!";
      return;
    }

    resultsDiv.innerHTML = validRecipes.map(createRecipeCard).join("");
  } catch (err) {
    loadingDiv.hidden = true;
    resultsDiv.innerHTML = "Something went wrong with the ritual.";
    console.error(err);
  }
}

document.getElementById("searchButton").addEventListener("click", () => {
  const ingredients = document.getElementById("ingredientInput").value.trim();
  const preference = document.getElementById("tastePreference").value;
  const diet = document.getElementById("dietPreference").value;
  const strict = document.getElementById("strictMode").checked;

  if (!ingredients) return alert("Please enter some ingredients!");

  const url = `/api/recipes?ingredients=${encodeURIComponent(ingredients)}&preference=${preference}&diet=${diet}&strict=${strict}`;
  fetchAndDisplayRecipes(url, document.getElementById("results"), document.getElementById("loading"));
});

document.getElementById("surpriseButton").addEventListener("click", () => {
  const preference = document.getElementById("tastePreference").value;
  const diet = document.getElementById("dietPreference").value;
  const strict = document.getElementById("strictMode").checked;

  const url = `/api/recipes?surprise=true&preference=${preference}&diet=${diet}&strict=${strict}`;
  fetchAndDisplayRecipes(url, document.getElementById("results"), document.getElementById("loading"));
});

function askWitch() {
  const input = document.getElementById("witchInput").value.trim().toLowerCase();
  const output = document.getElementById("witchResponse");

  if (input === "") {
    output.textContent = "Speak your sin, mortal...";
    return;
  }

  output.textContent = "The witch is typing...";

  setTimeout(() => {
    const responses = [
      "You are forgiven. But only just.",
      "Repent with soup.",
      "The fridge spirits are disappointed — but not surprised.",
      "I’ve seen worse. Much worse.",
      "An offense most foul... and flavorful.",
      "A dark admission. The onions weep.",
      "Your shame is noted in the cookbook of the damned.",
      "Let this be a lesson — or a marinade.",
      "Unholy, but relatable.",
      "Your secret is safe with the mayonnaise spirits."
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    output.textContent = randomResponse;
  }, 1000);
}
