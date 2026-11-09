const foodSearch = document.getElementById("foodSearch");
const foodCategory = document.getElementById("foodCategory");
const findFoodGrid = document.getElementById("findFoodGrid");
const findEmpty = document.getElementById("findEmpty");
const findMessage = document.getElementById("findMessage");
const { apiRequest, getCurrentUser, escapeHtml } = window.AaharLink;

let foods = [];

function isUnexpired(food) {
  return !food.expires_at || new Date(food.expires_at) > new Date();
}

function renderFindFood() {
  const query = foodSearch.value.trim().toLowerCase();
  const category = foodCategory.value;
  const results = foods.filter(food => {
    const text = `${food.title} ${food.location} ${food.category}`.toLowerCase();
    return text.includes(query) &&
      (category === "All" || food.category === category) &&
      food.status === "Available" &&
      isUnexpired(food);
  });

  findFoodGrid.innerHTML = results.map(food => `
    <article class="listing-card">
      <img src="${escapeHtml(food.image || "https://images.unsplash.com/photo-1547592180-85f173990554?w=600")}" alt="${escapeHtml(food.title)}">
      <div class="listing-body">
        <span class="listing-status">Available</span>
        <h3>${escapeHtml(food.title)}</h3>
        <p>📍 ${escapeHtml(food.location)}</p>
        <p>🍱 Quantity: ${Number(food.quantity) || 0}</p>
        <p>Shared by donor #${Number(food.donor_id)}</p>
        <p>${escapeHtml(food.category)}</p>
        ${food.expires_at ? `<p>Pickup by: ${new Date(food.expires_at).toLocaleString()}</p>` : ""}
        ${food.description ? `<p>${escapeHtml(food.description)}</p>` : ""}
        <label class="request-quantity-label">
          Quantity to request
          <input class="request-quantity" type="number" min="1" max="${Number(food.quantity)}" value="1" required>
        </label>
        <button class="btn btn-primary request-btn" data-id="${Number(food.id)}">
          Request food
        </button>
      </div>
    </article>
  `).join("");

  findEmpty.hidden = results.length > 0;
}

async function loadFoods() {
  findMessage.textContent = "Loading available food...";
  try {
    foods = await apiRequest("/donations/");
    findMessage.textContent = "";
    renderFindFood();
  } catch (error) {
    findMessage.textContent = `Could not load donations: ${error.message}`;
    findEmpty.hidden = true;
  }
}

findFoodGrid.addEventListener("click", async event => {
  const button = event.target.closest(".request-btn");
  if (!button) return;

  const user = getCurrentUser();
  if (!user?.id) {
    window.location.href = "login.html";
    return;
  }
  if (user.role === "donor") {
    findMessage.textContent = "Only food seekers can request a donation.";
    return;
  }

  const food = foods.find(item => item.id === Number(button.dataset.id));
  if (!food) return;
  if (food.donor_id === user.id) {
    findMessage.textContent = "You cannot request your own donation.";
    return;
  }

  const quantityInput = button.parentElement.querySelector(".request-quantity");
  const quantity = Number(quantityInput.value);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > food.quantity) {
    findMessage.textContent = `Enter a whole number between 1 and ${food.quantity}.`;
    return;
  }

  button.disabled = true;
  findMessage.textContent = "Sending your request...";
  try {
    await apiRequest("/food-requests/", {
      method: "POST",
      body: JSON.stringify({
        food_id: food.id,
        seeker_id: user.id,
        quantity,
        message: ""
      })
    });
    findMessage.textContent = "Your food request was sent.";
  } catch (error) {
    findMessage.textContent = `Could not send request: ${error.message}`;
  } finally {
    button.disabled = false;
  }
});

foodSearch.addEventListener("input", renderFindFood);
foodCategory.addEventListener("change", renderFindFood);
loadFoods();
