import { renderEventCard, fetchEvents } from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {

    const upcomingContainer = document.getElementById("upcoming-events");
    const pastContainer = document.getElementById("past-events");

    const showSkeletons = (container, count = 3) => {
        container.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const skeleton = document.createElement('div');
            skeleton.className = `skeleton-card`;
            skeleton.innerHTML = `
                <div class="skeleton skeleton-image"></div>
                <div class="skeleton-content">
                    <div class="skeleton skeleton-title"></div>
                    <div class="skeleton skeleton-details">
                        <div class="skeleton skeleton-detail"></div>
                        <div class="skeleton skeleton-detail"></div>
                        <div class="skeleton skeleton-detail"></div>
                    </div>
                    <div class="skeleton skeleton-subtext"></div>
                    <div class="skeleton skeleton-subtext" style="width: 60%;"></div>
                </div>
            `;
            container.appendChild(skeleton);
        }
    }
    
    showSkeletons(upcomingContainer);
    showSkeletons(pastContainer);

    try {
        
        let events = await fetchEvents();

        // Clear skeletons
        upcomingContainer.innerHTML = '';
        pastContainer.innerHTML = '';

        // Separate upcoming and past
        const now = new Date();
        const upcoming = events.filter(e => e.event_date >= now);
        const past = events.filter(e => e.event_date < now);

        // Clear loaders
        upcomingContainer.innerHTML = "";
        pastContainer.innerHTML = "";

        // Render upcoming events
        if (upcoming.length > 0) {
            upcoming.forEach(event => 
                renderEventCard(event, upcomingContainer, 0, '../pages/event_details.html')
            );
        } else {
            upcomingContainer.innerHTML = "<p class='empty'>No upcoming events.</p>";
        }

        // Render past events
        if (past.length > 0) {
            past.forEach(
                event => renderEventCard(event, pastContainer, 0, '../pages/event_details.html')
            );
        } else {
            pastContainer.innerHTML = "<p class='empty'>No past events.</p>";
        }

    } catch (err) {
        console.error(err);
        upcomingContainer.innerHTML = "<p class='empty'>Failed to load upcoming events.</p>";
        pastContainer.innerHTML = "<p class='empty'>Failed to load past events.</p>";
    }

    
});


