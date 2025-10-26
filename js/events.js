console.log("loading");

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("event-cards");

  try {
    const response = await fetch("https://izg-backend.onrender.com/api/events");
    let events = await response.json();
    var eventCounter = 0;

    console.log("loading");
    console.log(events);

    // 🔹 Convert event_date strings to Date objects
    events = events.map(event => ({
      ...event,
      event_date: new Date(event.event_date)
    }));

    // 🔹 Sort events by event_date (descending: latest first)
    events.sort((a, b) => b.event_date - a.event_date);

    // 🔹 Keep only the first three events
    events = events.length > 3 ? events.slice(0, 3) : events;

    events.forEach(event => {
      eventCounter += 1;

      const card = document.createElement("a");
      const imageUrl = event.image_url ? event.image_url : "../resources/default-event.jpeg";
      card.href = `./pages/event_details.html?eventId=${event.id}`;
      card.className = eventCounter == 2 ? "event-card middle" : "event-card";

      const formattedDate = event.event_date.toLocaleDateString("en-ZA", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      card.innerHTML = `
        <img src=${imageUrl} alt="${event.name}" class="event-image"/>
        <div class="event-content">
          <div class="event-details">
            <p class="date">${formattedDate}</p>
            <p class="location">${event.location}</p>
          </div>
          <div class="content">
            <p class="title">${event.name}</p>
            <p class="subtext">${event.description}</p>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    if (events.length === 0) {
      container.innerHTML = "<p>No events available.</p>";
    }
  } catch (err) {
    container.innerHTML = "<p>Failed to load events. Please try again later.</p>";
    console.error(err);
  }
});
