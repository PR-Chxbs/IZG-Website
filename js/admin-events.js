const API_URL = "https://izg-backend.onrender.com/api/events";
const userId = 13; // Replace with logged-in user's ID (from localStorage or auth system)

// DOM elements
const form = document.getElementById("eventForm");
const message = document.getElementById("message");
const eventsBody = document.getElementById("eventsBody");
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submitBtn");

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
    message.textContent = " Failed to load events.";
  }
}

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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });

    const result = await res.json();

    if (res.ok) {
      message.textContent = eventId
        ? " Event updated successfully!"
        : " Event created successfully!";
      form.reset();
      document.getElementById("event_id").value = "";
      formTitle.textContent = "Create New Event";
      submitBtn.textContent = "Create Event";
      loadEvents();
    } else {
      message.textContent = ` ${result.message || "Error saving event"}`;
    }
  } catch (error) {
    console.error(error);
    message.textContent = " Could not connect to server.";
  }
});

// Edit Event
async function editEvent(id) {
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
    message.textContent = " Failed to load event details.";
  }
}

// Delete Event
async function deleteEvent(id) {
  if (!confirm("Are you sure you want to delete this event?")) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    const result = await res.json();

    if (res.ok) {
      message.textContent = " Event deleted successfully!";
      loadEvents();
    } else {
      message.textContent = ` ${result.message}`;
    }
  } catch (error) {
    console.error(error);
    message.textContent = " Could not connect to server.";
  }
}

// Initial load
loadEvents();
