import { getApiUrl, decodeJWT, showSnackbar } from "./utils.js";

const apiBaseUrl = getApiUrl();

checkSession();

document.getElementById("logo").addEventListener("click", () => {
  window.location.href = "/"
})

document.getElementById("loginForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const rememberMe = document.getElementById("remember-me").checked;

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
      const payload = decodeJWT(data.token);

      if (payload.role !== "Admin") {
        showSnackbar(`User not authorized!`);
        return
      }

      // Store token for authenticated requests
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("rememberMe", rememberMe);

      window.location.href = "/admin";
    } else {
      showSnackbar("Invalid login. Please check your credentials.");
    }
  } catch (error) {
    console.error("Login error:", error);
    showSnackbar("Login failed. Please try again later.");
  }
});

function checkSession() {
  const localRememberMe = localStorage.getItem("rememberMe") === "true" ? true : false;
  const token = localStorage.getItem("authToken");

  if (!token) {
    localStorage.removeItem("rememberMe");
    return;
  }

  // console.log(`(checkSession) Remember Me: ${localRememberMe}`);
  if (localRememberMe) {
    const payload = decodeJWT(token);

    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp < currentTime) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("rememberMe");
        showSnackbar("Session expired. Login again.");
        return;
    }

    console.log("Redirecting...");
    window.location.href = "/admin";
  }
}