import { getApiUrl, showSnackbar } from "../utils.js";

const params = new URLSearchParams(window.location.search);
const blogId = params.get("blogId");
const API_URL = `${getApiUrl}/posts`;

const token = localStorage.getItem("authToken");

function slugify(inputText) {
    if (!inputText) {
        return null
    }
    return inputText.replace(" ", "-").toLowerCase().trim()
}

async function getUserIds() {
    try {
        const res = await fetch(`${getApiUrl()}/users`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const users = await res.json();
        const returnObject = {};
        users.forEach((user) => {
            returnObject[user.id] = `${user.first_name} ${user.second_name}`;
        });
        console.log(JSON.stringify(returnObject));
        return returnObject;
    } catch (error) {
        showSnackbar(error);
    }
}

getUserIds();