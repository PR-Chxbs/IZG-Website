console.log("loading");

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("event-container");

  try {
    const response = await fetch("https://izg-backend.onrender.com/api/events");
    const posts = await response.json();
    console.log("loading");
    console.log(events);

    posts.forEach(events => {
      if (!events.published) {
        
        return;
      } 

      const card = document.createElement("a");
      card.href = `/blog/${events.slug}`;
      card.className = "blog-card";

      card.innerHTML = `
        <img src="../resources/default-event.jpeg" alt="${events.name}" />
        <div class="content">
          <h2 class="title">${events.name}</h2>
          <p class="subtext">${events.description}</p>
          <p class="date">${new Date(events.published_at).toLocaleDateString()}</p>
          <p class="date">${new Date(events_date).toLocaleDateString()}</p>
        </div>
      `;

      container.appendChild(card);
    });

    if (eventss.length === 0) {
      container.innerHTML = "<p>No events available.</p>";
    }
  } catch (err) {
    container.innerHTML = "<p>Failed to load events. Please try again later.</p>";
    console.error(err);
  }
});
