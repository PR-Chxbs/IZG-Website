import { getApiUrl, showSnackbar } from "../utils.js";

const API_URL = getApiUrl() + "/messages";

const messagesTableBody = document.getElementById("tableBody");

const messages = await getMessages();

messages.forEach((message) => {
    const messageRow = document.createElement("tr");
    messageRow.innerHTML = `
        <td>${message.id}</td>
        <td>${message.full_name}</td>
        <td><a href="mailto:${message.email}">${message.email}</a></td>
        <td>${message.phone_number}</td>
        <td>${message.inquiry_type}</td>
        <td>${new Date(message.sent_at).toLocaleDateString()} ${new Date(message.sent_at).toLocaleTimeString()}</td>
    `;

    messagesTableBody.appendChild(messageRow);
});

async function getMessages() {
    try {
        const res = await fetch(API_URL);
        const messages = await res.json();

        return messages;
    } catch (error) {
        showSnackbar(error);
    }
}