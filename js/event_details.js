async function fetchEventDetails() {
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get("eventId");

    if (!eventId) {
        document.getElementById("event-details").innerHTML = "<div class='error'>No event ID provided.</div>";
        return;
    }

    const apiUrl = `https://izg-backend.onrender.com/api/events/${eventId}`;

    try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("Failed to fetch event details");

        const event = await res.json();
        document.title = event.name;
        renderEvent(event);
    } catch (err) {
        console.error(err);
        document.getElementById("event-details").innerHTML = `<div class='error'>Unable to load event details. Please try again later.</div>`;
    }
}

function renderEvent(event) {
    const container = document.getElementById("event-details");
    const eventDate = new Date(event.event_date);
    const formattedDate = eventDate.toLocaleDateString("en-ZA", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    // Replace skeleton with real content
    container.innerHTML = `
        <a href="/pages/events.html" class="back-btn">← Back to all events</a>
        <div class="image-container">
          <img src="${event.image_url}" alt="${event.name}">
        </div>

        <div class="event-info">
          <h1>${event.name}</h1>

          <div class="meta">
            <span>📍 ${event.location}</span>
            <span>📅 ${formattedDate}</span>
            <span>🕒 ${event.start_time} - ${event.end_time}</span>
          </div>

          <div class="description">
            ${event.description}
          </div>
        </div>
      `;
}

// Simulate smooth loading with a short delay (optional UX enhancement)
setTimeout(fetchEventDetails, 800);