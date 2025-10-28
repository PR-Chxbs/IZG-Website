// authGuard.js

function redirectToLogin() {
    window.location.href = "/auth/login.html";
}

function decodeJWT(token) {
    try {
        const base64Payload = token.split(".")[1];
        const decodedPayload = atob(base64Payload);
        return JSON.parse(decodedPayload);
    } catch (error) {
        return null;
    }
}

function checkAuthorization() {
    const token = localStorage.getItem("jwt_token");

    // No token? Not logged in →
    if (!token) {
        redirectToLogin();
        return;
    }

    const payload = decodeJWT(token);

    // Invalid token?
    if (!payload) {
        redirectToLogin();
        return;
    }

    // Check expiry
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp < currentTime) {
        localStorage.removeItem("jwt_token");
        redirectToLogin();
        return;
    }

    if (payload.role !== "Admin") {
        redirectToLogin();
        return;
    }

    // // If we reach here → Access granted ✅
    // console.log("User authorized:", payload);
}

// Run check immediately
checkAuthorization();
