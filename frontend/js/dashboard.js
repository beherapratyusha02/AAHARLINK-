const currentUser = window.AaharLink.getCurrentUser();
const { apiRequest, escapeHtml } = window.AaharLink;

if (!currentUser?.id) {
  window.location.href = "login.html";
} else {
  const welcomeHeading = document.getElementById("welcomeHeading");
  const userName = document.getElementById("userName");
  const userRole = document.getElementById("userRole");
  const dashboardMessage = document.getElementById("dashboardMessage");
  const grid = document.getElementById("dashboardFoodGrid");
  let foods = [];
  let selectedFilter = "All";

  welcomeHeading.textContent = `Hello, ${currentUser.name.split(" ")[0]}! 🌿`;
  userName.textContent = currentUser.name;
  userRole.textContent = currentUser.role === "both"
    ? "Donor & Food Seeker"
    : currentUser.role === "donor" ? "Food Donor" : "Food Seeker";

  function isUnexpired(food) {
    return !food.expires_at || new Date(food.expires_at) > new Date();
  }

  function renderFoods() {
    const searchTerm = document.getElementById("dashboardSearch").value
      .trim().toLowerCase();
    const filteredFoods = foods.filter(food => {
      const matchesCategory = selectedFilter === "All" ||
        food.category === selectedFilter;
      const searchableText =
        `${food.title} ${food.location} ${food.category}`.toLowerCase();
      return matchesCategory &&
        searchableText.includes(searchTerm) &&
        food.status === "Available" &&
        isUnexpired(food);
    });

    grid.innerHTML = filteredFoods.map(food => `
      <article class="listing-card">
        <img src="${escapeHtml(food.image || "https://images.unsplash.com/photo-1547592180-85f173990554?w=600")}" alt="${escapeHtml(food.title)}">
        <div class="listing-body">
          <span class="listing-status">Available</span>
          <h3>${escapeHtml(food.title)}</h3>
          <p>📍 ${escapeHtml(food.location)}</p>
          <p>🍱 Quantity: ${Number(food.quantity) || 0} meals/items</p>
          <p>Shared by donor #${Number(food.donor_id)}</p>
          <span class="listing-meta">${escapeHtml(food.category)}</span>
          ${food.expires_at ? `<p>Pickup by: ${new Date(food.expires_at).toLocaleString()}</p>` : ""}
        </div>
      </article>
    `).join("");

    document.getElementById("emptyListings").hidden =
      filteredFoods.length > 0;
  }

  async function loadDashboard() {
    dashboardMessage.textContent = "Loading your dashboard...";
    try {
      const [stats, donations, availableFoods] = await Promise.all([
        apiRequest(`/dashboard/${encodeURIComponent(currentUser.id)}`),
        apiRequest(`/donations/donor/${encodeURIComponent(currentUser.id)}`),
        apiRequest("/donations/")
      ]);
      if (!stats.success) {
        throw new Error(stats.message || "Could not load your account.");
      }

      const liveFoods = availableFoods.filter(food =>
        food.status === "Available" && isUnexpired(food)
      );
      document.getElementById("totalListings").textContent =
        donations.length;
      document.getElementById("totalMeals").textContent =
        donations.reduce((total, food) => total + Number(food.quantity || 0), 0);
      document.getElementById("foodRequests").textContent =
        stats.statistics.food_requests;
      foods = liveFoods;
      dashboardMessage.textContent = "";
      renderFoods();
    } catch (error) {
      dashboardMessage.textContent =
        `Could not load dashboard data: ${error.message}`;
    }
  }

  document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(item =>
        item.classList.remove("active")
      );
      button.classList.add("active");
      selectedFilter = button.dataset.filter;
      renderFoods();
    });
  });

  document.getElementById("dashboardSearch").addEventListener(
    "input",
    renderFoods
  );

  document.getElementById("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem("aaharCurrentUser");
    window.location.href = "login.html";
  });

  document.getElementById("sidebarToggle").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("open");
  });

  loadDashboard();
}
