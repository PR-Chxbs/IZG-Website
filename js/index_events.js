import { renderEventCard, fetchEvents } from "./utils.js";

console.log("loading");

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("event-cards");

  try {
    let eventCounter = 0;
    
    let events = await fetchEvents();

    // 🔹 Keep only the first three events
    events = events.length > 3 ? events.slice(0, 3) : events;

    events.forEach(event => {
      eventCounter += 1;

      renderEventCard(event, container, eventCounter)
      
    });

    if (events.length === 0) {
      container.innerHTML = "<p>No events available.</p>";
    }
  } catch (err) {
    container.innerHTML = "<p>Failed to load events. Please try again later.</p>";
    console.error(err);
  }
});