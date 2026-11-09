
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (navLinks) {
  const currentUser = window.AaharLink.getCurrentUser();
  if (currentUser) {
    if (/\/pages\/(?:index\.html)?$/.test(window.location.pathname)) {
      window.location.replace("dashboard.html");
    }

    document.querySelectorAll('a[href="login.html"]').forEach(link => {
      link.href = "dashboard.html";
      link.textContent = "Dashboard";
    });

    const registerLink = navLinks.querySelector('a[href="register.html"]');
    document.querySelectorAll('a[href="register.html"]').forEach(link => {
      link.href = "dashboard.html";
    });

    if (registerLink) {
      const logoutButton = document.createElement("button");
      logoutButton.type = "button";
      logoutButton.className = registerLink.className;
      logoutButton.dataset.logout = "";
      logoutButton.textContent = "Logout";
      registerLink.replaceWith(logoutButton);
    }
  }
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    menuToggle.setAttribute(
      "aria-expanded",
      navLinks.classList.contains("open")
    );
  });
}

navLinks?.addEventListener("click", event => {
  navLinks.classList.remove("open");

  if (event.target.closest("[data-logout]")) {
    window.AaharLink.logout();
    window.location.href = "index.html";
  }
});
