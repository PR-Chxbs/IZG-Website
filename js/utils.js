export const renderEventCard = (eventData, parentClass, eventCounter = 0, pagePath = './pages/event_details.html') => {
  const card = document.createElement("a");

  const imageUrl = eventData.image_url ? eventData.image_url : "../resources/default-event.jpeg";
  card.href = `${pagePath}?eventId=${eventData.id}`;
  card.className = eventCounter == 2 ? "event-card middle" : "event-card";

  const formattedDate = eventData.event_date.toLocaleDateString("en-ZA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  card.innerHTML = `
    <img src=${imageUrl} alt="${eventData.name}" class="event-image"/>
    <div class="event-content">
      <div class="event-details">
        <p class="date">${formattedDate}</p>
        <p class="location">${eventData.location}</p>
      </div>
      <div class="content">
        <p class="title">${eventData.name}</p>
        <p class="subtext">${eventData.description}</p>
      </div>
    </div>
  `;

  parentClass.appendChild(card);
}

export const fetchEvents = async () => {
  const response = await fetch("https://izg-backend.onrender.com/api/events");
    let events = await response.json();
    
    console.log("loading");
    console.log(events);

    // 🔹 Convert event_date strings to Date objects
    events = events.map(event => ({
      ...event,
      event_date: new Date(event.event_date)
    }));

    // 🔹 Sort events by event_date (descending: latest first)
    events.sort((a, b) => b.event_date - a.event_date);

    return events;
}