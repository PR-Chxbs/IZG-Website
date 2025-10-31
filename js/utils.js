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
        <div class="icon-text">
          <img src="/resources/icons/clock_icon.png" class="icon" alt="Clock icon"/>
          <p class="date">${formattedDate}</p>
        </div>
        
        <div class="icon-text">
          <img src="/resources/icons/location_icon.png" class="icon" alt="Location icon"/>
          <p class="location">${eventData.location}</p>
        </div>
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
    
    // console.log("loading");
    // console.log(events);

    // 🔹 Convert event_date strings to Date objects
    events = events.map(event => ({
      ...event,
      event_date: new Date(event.event_date)
    }));

    // 🔹 Sort events by event_date (descending: latest first)
    events.sort((a, b) => b.event_date - a.event_date);

    return events;
}

export const showSnackbar = (message) => {
    const sb = document.getElementById('snackbar');
    sb.textContent = message;
    sb.classList.add('show');

    setTimeout(() => {
        sb.classList.remove('show');
    }, 3000); // hides after 3s
}

export const decodeJWT = (token) => {
    try {
        const base64Payload = token.split(".")[1];
        const decodedPayload = atob(base64Payload);
        return JSON.parse(decodedPayload);
    } catch (error) {
        return null;
    }
}

export const getApiUrl = () => {
  const remote = true;
  return remote ? "https://izg-backend.onrender.com/api" : "http://localhost:5000/api";
}

// confirmationDialog.js
export const showConfirmationDialog = async (heading, description, cancelText, proceedText) => {
    return new Promise((resolve) => {
        // Create the overlay
        const overlay = document.createElement("div");
        overlay.classList.add("confirm-overlay");

        // Create the dialog box
        const dialog = document.createElement("div");
        dialog.classList.add("confirm-dialog");

        dialog.innerHTML = `
            <h2>${heading}</h2>
            <p>${description}</p>
            <div class="confirm-actions">
                <button id="confirm-cancel-btn" class="cancel-btn">${cancelText}</button>
                <button id="confirm-proceed-btn" class="proceed-btn">${proceedText}</button>
            </div>
        `;

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // Animate in
        requestAnimationFrame(() => {
            overlay.classList.add("show");
            dialog.classList.add("show");
        });

        // Event handlers
        document.getElementById("confirm-cancel-btn").addEventListener("click", () => {
            close(false);
        });

        document.getElementById("confirm-proceed-btn").addEventListener("click", () => {
            close(true);
        });

        function close(result) {
            // Animate out
            overlay.classList.remove("show");
            dialog.classList.remove("show");

            setTimeout(() => {
                document.body.removeChild(overlay);
                resolve(result);
            }, 250);
        }
    });
}

export const validatePassword = (password) => {
  const minLength = /.{8,}/;
  const hasUpper = /[A-Z]/;
  const hasLower = /[a-z]/;
  const hasNumber = /[0-9]/;
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/;

  if (!minLength.test(password)) {
    showSnackbar("Password must have a min length of 8 characters");
    return false;
  }

  if (!hasUpper.test(password) || !hasLower.test(password)) {
    showSnackbar("Password must have atleast 1 upper case and lower case letter");
    return false;
  }

  if(!hasNumber.test(password)) {
    showSnackbar("Password must have atleast 1 number");
    return false;
  }

  if(!hasSpecial.test(password)) {
    showSnackbar(`Password must include atleast 1 special character (!@#$...)`);
    return false;
  }

  return true;
}
