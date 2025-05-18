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
  return text.replace(/<\/?[^>]+(>|$)/g, "").replace(/&nbsp;/g, " ").trim();
}

function getStarSignMessage(sign) {
  const messages = {
    aries: "An Aries spell needs spice — maybe too much.",
    taurus: "Taurus desires comfort... and creamy potatoes.",
    gemini: "Dual tastes detected. Sweet? Savoury? Both?",
    cancer: "Soft shell, soft cheese. Cancer energy.",
    leo: "Leo demands flair. Gold flakes optional.",
    virgo: "Every sprinkle must be precise. Virgo-style.",
    libra: "Balance is everything. Also: wine pairing.",
    scorpio: "Dangerous desires stir. Chocolate? Chili?",
    sagittarius: "Roaming spirit detected. Curry likely.",
    capricorn: "Serious about structure. Like lasagna layers.",
    aquarius: "Experimental vibes. You might invent a salad.",
    pisces: "A soup. Always a soup. It's written.",
    none: null
  };
  return messages[sign] || null;
}

function createRecipeCard(recipe) {
  if (!recipe.sourceUrl || !recipe.sourceUrl.startsWith("http")) return "";

  const title = sanitize(recipe.title);
  const image = recipe.image;
  const link = recipe.sourceUrl;

  return `
    <div class="recipe-card">
      <a href="${link}" target="_blank" rel="noopener noreferrer">
        <h3>${title}</h3>
        <img src="${image}" alt="${title}" />
      </a>
      <p>✨ A curious choice conjured just for you...</p>
    </div>
  `;
}

async function fetchAndDisplayRecipes(url, resultsDiv, loadingDiv) {
  loadingDiv.hidden = false;
  resultsDiv.innerHTML = "";

  const selectedSign = document.getElementById("starSign").value;
  const signMessage = getStarSignMessage(selectedSign);
  const steps = [
    ...(signMessage ? [signMessage] : []),
    "Consulting the pantry spirits...",
    "Grinding garlic dust...",
    "Translating forbidden recipes...",
    "Whisking quantum eggs...",
    "Summoning complete!"
  ];

  await showSpellSteps(steps);

  try {
    const res = await fetch(url);
    const data = await res.json();

    loadingDiv.hidden = true;

    const validRecipes = data.filter(
      r => r.title && r.image && r.sourceUrl && r.sourceUrl.startsWith("http")
    );

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

// 🧙 Confession Box with animated "Witch is typing..."
function askWitch() {
  const input = document.getElementById("witchInput").value.trim().toLowerCase();
  const output = document.getElementById("witchResponse");

  if (input === "") {
    output.textContent = "Speak your sin, mortal...";
    return;
  }

  output.innerHTML = `<span class="typing">The witch is typing<span class="dots"></span></span>`;

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
  }, 3000);
}
