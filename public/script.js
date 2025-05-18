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

document.getElementById("searchButton").addEventListener("click", async () => {
  const ingredients = document.getElementById("ingredientInput").value.trim();
  const preference = document.getElementById("tastePreference").value;
  const diet = document.getElementById("dietPreference").value;
  const strict = document.getElementById("strictMode").checked;

  if (!ingredients) return alert("Please enter some ingredients!");

  const loadingDiv = document.getElementById("loading");
  const resultsDiv = document.getElementById("results");

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
    const res = await fetch(`/api/recipes?ingredients=${encodeURIComponent(ingredients)}&preference=${preference}&diet=${diet}&strict=${strict}`);
    const data = await res.json();

    loadingDiv.hidden = true;

    if (!data.length) {
      resultsDiv.innerHTML = "No recipes found. The fridge spirits are puzzled!";
      return;
    }

    resultsDiv.innerHTML = data.map(recipe => `
      <div class="recipe-card">
        <a href="${recipe.sourceUrl}" target="_blank" rel="noopener noreferrer">
          <h3>${recipe.title}</h3>
          <img src="${recipe.image}" alt="${recipe.title}" />
        </a>
        <p>✨ A curious choice conjured just for you...</p>
      </div>
    `).join("");
  } catch (err) {
    loadingDiv.hidden = true;
    resultsDiv.innerHTML = "Something went wrong with the ritual.";
    console.error(err);
  }
});

document.getElementById("surpriseButton").addEventListener("click", async () => {
  const preference = document.getElementById("tastePreference").value;
  const diet = document.getElementById("dietPreference").value;
  const strict = document.getElementById("strictMode").checked;

  const loadingDiv = document.getElementById("loading");
  const resultsDiv = document.getElementById("results");

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
    const res = await fetch(`/api/recipes?surprise=true&preference=${preference}&diet=${diet}&strict=${strict}`);
    const data = await res.json();

    loadingDiv.hidden = true;

    if (!data.length) {
      resultsDiv.innerHTML = "The fridge spirits are silent. Try again!";
      return;
    }

    resultsDiv.innerHTML = data.map(recipe => `
      <div class="recipe-card">
        <a href="${recipe.sourceUrl}" target="_blank" rel="noopener noreferrer">
          <h3>${recipe.title}</h3>
          <img src="${recipe.image}" alt="${recipe.title}" />
        </a>
        <p>✨ A curious choice conjured just for you...</p>
      </div>
    `).join("");
  } catch (err) {
    loadingDiv.hidden = true;
    resultsDiv.innerHTML = "Something went wrong with the ritual.";
    console.error(err);
  }
});

// Fridge Confession Box
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
