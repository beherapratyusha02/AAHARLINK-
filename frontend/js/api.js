(() => {
  const apiBaseUrl = (window.AAHARLINK_API_URL || "http://127.0.0.1:8000/api")
    .replace(/\/+$/, "");

  function getErrorMessage(data) {
    if (typeof data === "string") return data;
    if (typeof data?.detail === "string") return data.detail;
    if (Array.isArray(data?.detail)) {
      return data.detail.map(issue => issue.msg).join("; ");
    }

    return "The request could not be completed.";
  }

  async function apiRequest(path, options = {}) {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers
      }
    });

    const contentType = response.headers.get("content-type") || "";
    const data = response.status === 204
      ? null
      : contentType.includes("application/json")
        ? await response.json()
        : await response.text();
    if (!response.ok) {
      throw new Error(getErrorMessage(data));
    }

    return data;
  }

  function getCurrentUser() {
    const savedUser = localStorage.getItem("aaharCurrentUser") ||
      sessionStorage.getItem("aaharCurrentUser");
    if (!savedUser) return null;

    try {
      const user = JSON.parse(savedUser);
      if (user && typeof user === "object" && user.id) {
        localStorage.setItem("aaharCurrentUser", JSON.stringify(user));
        sessionStorage.removeItem("aaharCurrentUser");
        return user;
      }
    } catch {
      localStorage.removeItem("aaharCurrentUser");
      sessionStorage.removeItem("aaharCurrentUser");
      return null;
    }

    localStorage.removeItem("aaharCurrentUser");
    sessionStorage.removeItem("aaharCurrentUser");
    return null;
  }

  function logout() {
    localStorage.removeItem("aaharCurrentUser");
    sessionStorage.removeItem("aaharCurrentUser");
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);
  }

  window.AaharLink = { apiRequest, getCurrentUser, logout, escapeHtml };
})();
