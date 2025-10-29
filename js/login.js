import { getApiUrl, decodeJWT, showSnackbar } from "./utils.js";

const apiBaseUrl = getApiUrl();

document.getElementById("logo").addEventListener("click", () => {
  window.location.href = "/"
})

document.getElementById("loginForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    showSnackbar("Please enter both email and password.");
    return;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.token) {
      // Store token for authenticated requests
      localStorage.setItem("authToken", data.token);
      const payload = decodeJWT(data.token);

      if (payload.role !== "Admin") {
        showSnackbar(`User not authorized!`);
        return
      }

      window.location.href = "/admin/events.html";
    } else {
      showSnackbar("Invalid login. Please check your credentials.");
    }
  } catch (error) {
    console.error("Login error:", error);
    showSnackbar("Login failed. Please try again later.");
  }
});
