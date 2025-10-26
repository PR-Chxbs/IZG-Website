console.log("loading");

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("event-cards");

  try {
    const response = await fetch("https://izg-backend.onrender.com/api/events");
    const events = await response.json();
    var eventCounter = 0;

    console.log("loading");
    console.log(events);

    events.forEach(event => {
      eventCounter += 1;
      
      if (eventCounter > 3) {
        return
      }

      const card = document.createElement("a");
      const imageUrl = event.image_url ? event.image_url : "../resources/default-event.jpeg"
      card.href = `./pages/event_details.html?eventId=${event.id}`;
      card.className = eventCounter == 2 ? "event-card middle" : "event-card";

      card.innerHTML = `
        <img src=${imageUrl} alt="${event.name}" class="event-image"/>
        <div class="event-content">
          <div class="event-details">
            <p class="date">${new Date(event.event_date).toLocaleDateString()}</p>
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
