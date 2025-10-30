import { getApiUrl } from "./utils.js";

const API_URL = `${getApiUrl()}/messages`;
const contactForm = document.getElementById("contact-form");

contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const messageData = {
        "full_name": document.getElementById("full-name").value,
        "email": document.getElementById("email").value,
        "phone_number": document.getElementById("phone-number").value,
        "inquiry_type": document.getElementById("type-of-inquiry").value
    };

    await sendMessage(messageData);
    
});

async function sendMessage(messageData) {
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(messageData)
        });

        if (!res.ok) {
            console.log(res.status);
        } else{
            alert("Message sent");
        }
    } catch (error) {
        console.log(error);
    }
}