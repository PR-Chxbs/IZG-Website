import { showSnackbar, getApiUrl, showConfirmationDialog } from "../utils.js";

const API_URL = `${getApiUrl()}/users`;

const token = localStorage.getItem("authToken");

// DOM elements
const tableBody = document.getElementById("tableBody");

document.getElementById("refresh-btn").addEventListener("click", () => {
    console.log("Refreshing list");
    loadUsers();
});

async function loadUsers() {
    try {
        const res = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const users = await res.json();
        
        tableBody.innerHTML = "";

        users.forEach((user) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.first_name}</td>
                <td>${user.second_name}</td>
                <td>${user.gender}</td>
                <td>${user.phone_number}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <button onclick="editEvent(${user.id})" class="btn-secondary">Edit</button>
                    <button onclick="deleteEvent(${user.id})" class="delete btn-primary">Delete</button>
                </td>
            `;

            tableBody.appendChild(row);
        });

    } catch (e) {
        showSnackbar("Internal error, please try again later");
    }
}

loadUsers();

function editEvent (id) {
    window.location.href = `/admin/manageUser.html?userId=${id}`;
}

async function deleteEvent (id) {
    const confirmed = await showConfirmationDialog(
        "Delete User",
        "Are you sure you want to delete user, this action cannot be undone.",
        "Cancel",
        "Delete"
    );

    if (confirmed) {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.ok) {
                showSnackbar("User successfully deleted");
                loadUsers();
            }
        } catch (e) {
            showSnackbar(e);
        }
    }
}

window.editEvent = editEvent;
window.deleteEvent = deleteEvent;