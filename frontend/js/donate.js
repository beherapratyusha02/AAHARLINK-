
const donateForm = document.getElementById("donateForm");
const { apiRequest, getCurrentUser } = window.AaharLink;

donateForm.addEventListener("submit", async event => {
  event.preventDefault();

  const user = getCurrentUser();
  if (!user?.id) {
    window.location.href = "login.html";
    return;
  }

  const expiry = new Date(document.getElementById("expiry").value);
  const message = document.getElementById("donateMessage");
  const submitButton = donateForm.querySelector("button[type='submit']");

  if (Number.isNaN(expiry.getTime()) || expiry <= new Date()) {
    message.textContent = "Please choose a future pickup deadline.";
    return;
  }

  const food = {
    title: document.getElementById("foodTitle").value.trim(),
    category: document.getElementById("category").value,
    quantity: Number(document.getElementById("quantity").value),
    location: document.getElementById("location").value.trim(),
    expires_at: expiry.toISOString(),
    description: document.getElementById("description").value.trim(),
    image: document.getElementById("foodImage").value.trim() ||
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=600"
  };

  submitButton.disabled = true;
  message.textContent = "Publishing your donation...";
  try {
    await apiRequest(`/donations/?donor_id=${encodeURIComponent(user.id)}`, {
      method: "POST",
      body: JSON.stringify(food)
    });
    message.textContent = "Donation published successfully.";
    donateForm.reset();
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);
  } catch (error) {
    message.textContent = error.message;
  } finally {
    submitButton.disabled = false;
  }
});