import { decodeJWT, showSnackbar, getApiUrl } from "./utils.js";

const params = new URLSearchParams(window.location.search);
const eventId = params.get("eventId");
const API_URL = `${getApiUrl()}/events`;

if (eventId) {
    editEvent(eventId);
}

const token = localStorage.getItem("authToken");
const payload = decodeJWT(token);

const userId = payload.user_id ? payload.user_id : 13;

// DOM elements
const form = document.getElementById("eventForm");
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submitBtn");

document.title = eventId ? "Admin | Edit Event" : "Admin | Create Event"

// Handle form submission (Create or Update)
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const eventData = {
    user_id: userId,
    name: document.getElementById("name").value,
    description: document.getElementById("description").value,
    event_date: document.getElementById("event_date").value,
    location: document.getElementById("location").value,
    start_time: document.getElementById("start_time").value,
    end_time: document.getElementById("end_time").value,
    image_url: document.getElementById("image_url").value,
  };

  const eventId = document.getElementById("event_id").value;

  const method = eventId ? "PUT" : "POST";
  const url = eventId ? `${API_URL}/${eventId}` : API_URL;

  try {
    const res = await fetch(url, {
      method,
      headers: {
         "Content-Type": "application/json",
         "Authorization": `Bearer ${token}`
        },
      body: JSON.stringify(eventData),
    });

    const result = await res.json();

    if (res.ok) {
      showSnackbar( `${eventId
        ? " Event updated successfully!"
        : "✅ Event created successfully!"}`);

      document.getElementById("event_id").value = "";
      
    } else {
      showSnackbar(` ${result.message || "Error saving event"}`);
    }
  } catch (error) {
    console.error(error);
    showSnackbar(" Could not connect to server.");
  }
});

// Edit Event
async function editEvent (id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const event = await res.json();

    document.getElementById("event_id").value = event.id;
    document.getElementById("name").value = event.name;
    document.getElementById("description").value = event.description;
    document.getElementById("event_date").value = event.event_date.split("T")[0];
    document.getElementById("location").value = event.location;
    document.getElementById("start_time").value = event.start_time;
    document.getElementById("end_time").value = event.end_time;
    document.getElementById("image_url").value = event.image_url;

    formTitle.textContent = "Edit Event";
    submitBtn.textContent = "Update Event";
  } catch (error) {
    console.error(error);
    showSnackbar(" Failed to load event details.");
  }
}