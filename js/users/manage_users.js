import { showSnackbar, getApiUrl } from "../utils.js";

const params = new URLSearchParams(window.location.search);
const userId = params.get("userId");
const API_URL = `${getApiUrl()}/users`;
//const API_URL = `http://localhost:5000/api/users`;
const token = localStorage.getItem("authToken");

const form = document.getElementById("userForm");

console.log(userId);

if (userId) {
    document.getElementById("heading").innerText = "Edit User";
    document.getElementById("submit-btn").innerText = "Save Changes";
    
    await preloadData(userId);
} else {
    injectPasswordRow();
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!userId) {
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        if (password !== confirmPassword) {
            showSnackbar("Passwords don't match!");
            return
        }    
    }

    const userData = getFormData();
    // console.log(JSON.stringify(userData));
    createEditUser(userData, userId);
})

async function createEditUser(userData, userId) {
    
    const requestUrl = userId ? `${API_URL}/${userId}` : API_URL;
    const method = userId ? "PUT" : "POST";
    
    try {
        const res = await fetch(requestUrl, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        });

        if (res.ok) {
            const snackBarMessage = userId ? "User successfully updated" : "User successfully created";
            showSnackbar(snackBarMessage);
        }

    } catch (e) {
        showSnackbar(e)
    }
}

async function preloadData(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const user = await res.json();

        const date = new Date(user.dob);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
        const day = date.getDate().toString().padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
        
        document.getElementById("user_id").value = user.id;

        document.getElementById("username").value = user.username;

        document.getElementById("first_name").value = user.first_name;
        document.getElementById("second_name").value = user.second_name;

        document.getElementById("gender").value = user.gender;
        document.getElementById("dob").value = `${year}-${month}-${day}`;

        document.getElementById("phone_number").value = user.phone_number;
        document.getElementById("email").value = user.email;

        document.getElementById("role").value = user.role;

    } catch (e) {
        showSnackbar(e)
    }
}

function injectPasswordRow() {
    const passwordRow = document.getElementById("password-row");
    passwordRow.innerHTML = `
        <div class="labelled-input">
            <label for="password">Password</label>
            <input type="password" placeholder="e.g. JohnD123" id="password" name="password" required>
        </div>
        <div class="labelled-input">
            <label for="confirm-password">Confirm Password</label>
            <input type="password" placeholder="e.g. JohnD123" id="confirm-password" name="confirm-password" required>
        </div>
    `;
}

function getFormData() {
    const formData = {
        username: document.getElementById("username").value,

        first_name: document.getElementById("first_name").value,
        second_name: document.getElementById("second_name").value,

        gender: document.getElementById("gender").value,
        dob: document.getElementById("dob").value,

        phone_number: document.getElementById("phone_number").value,
        email: document.getElementById("email").value,

        role: document.getElementById("role").value
    };

    if (!userId) {
        formData.password = document.getElementById("password").value;
    }

    return formData;
}