const apiBaseUrl = "https://izg-backend.onrender.com/api";

document.getElementById("loginForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
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

      alert(`Welcome back, ${data.user?.name || "Admin"}!`);
      window.location.href = "./adminEvents.html";
    } else {
      alert("Invalid login. Please check your credentials.");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Login failed. Please try again later.");
  }
});
