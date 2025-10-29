import { decodeJWT, showSnackbar, getApiUrl } from "./utils.js";

const API_URL = `${getApiUrl()}/events`;

const token = localStorage.getItem("authToken");
const payload = decodeJWT(token);

const userId = payload.user_id ? payload.user_id : 13;

// DOM elements
const eventsBody = document.getElementById("eventsBody");

// Fetch and display all events
async function loadEvents() {
  try {
    const res = await fetch(API_URL);
    const events = await res.json();

    eventsBody.innerHTML = "";
    events.forEach((event) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${event.id}</td>
        <td>${event.name}</td>
        <td>${new Date(event.event_date).toLocaleDateString()}</td>
        <td>${event.location}</td>
        <td>
          <button onclick="editEvent(${event.id})">Edit</button>
          <button onclick="deleteEvent(${event.id})" class="delete">Delete</button>
        </td>
      `;
      eventsBody.appendChild(row);
    });
  } catch (error) {
    console.error(error);
    showSnackbar("Failed to load events.");
  }
}

// Edit Event
async function editEvent(id) {
  console.log(`Edit clicked: Event ${id}`)
  window.location.href = `/admin/manageEvent.html?eventId=${id}`;
}

// Delete Event
async function deleteEvent(id) {
  if (!confirm("Are you sure you want to delete this event?")) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, 
        { 
            method: "DELETE",
            headers: {
         "Authorization": `Bearer ${token}`
        },
        });
    const result = await res.json();

    if (res.ok) {
      showSnackbar(" Event deleted successfully!");
      loadEvents();
    } else {
      showSnackbar(` ${result.message}`);
    }
  } catch (error) {
    console.error(error);
    showSnackbar(" Could not connect to server.");
  }
}

// Initial load
loadEvents();

window.editEvent = editEvent;
window.deleteEvent = deleteEvent;