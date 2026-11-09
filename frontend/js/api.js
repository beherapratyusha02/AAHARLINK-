(() => {
  const apiBaseUrl = (window.AAHARLINK_API_URL || "http://127.0.0.1:8000/api")
    .replace(/\/+$/, "");

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
      const detail = typeof data === "string"
        ? data
        : typeof data?.detail === "string"
        ? data.detail
        : Array.isArray(data?.detail)
          ? data.detail.map(issue => issue.msg).join("; ")
          : "The request could not be completed.";
      throw new Error(detail);
    }

    return data;
  }

  function getCurrentUser() {
    return JSON.parse(sessionStorage.getItem("aaharCurrentUser") || "null");
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

  window.AaharLink = { apiRequest, getCurrentUser, escapeHtml };
})();
