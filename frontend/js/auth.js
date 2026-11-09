
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const { apiRequest } = window.AaharLink;

if (registerForm) {
  registerForm.addEventListener("submit", async event => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const phone = document.getElementById("phone").value.trim() || null;
    const role = document.getElementById("role").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const message = document.getElementById("registerMessage");
    const submitButton = registerForm.querySelector("button[type='submit']");

    if (password.length < 8) {
      message.textContent = "Password must have at least 8 characters.";
      return;
    }

    if (password !== confirmPassword) {
      message.textContent = "Passwords do not match.";
      return;
    }

    submitButton.disabled = true;
    message.textContent = "Creating your account...";
    try {
      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, phone, role, password })
      });
      message.textContent = "Registration successful. You can now log in.";
      registerForm.reset();
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1000);
    } catch (error) {
      message.textContent = error.message;
    } finally {
      submitButton.disabled = false;
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async event => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const message = document.getElementById("loginMessage");
    const submitButton = loginForm.querySelector("button[type='submit']");

    submitButton.disabled = true;
    message.textContent = "Signing in...";
    try {
      const user = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      sessionStorage.setItem("aaharCurrentUser", JSON.stringify(user));
      window.location.href = "dashboard.html";
    } catch (error) {
      message.textContent = error.message;
    } finally {
      submitButton.disabled = false;
    }
  });
}