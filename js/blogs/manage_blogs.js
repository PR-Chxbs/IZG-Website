import { getApiUrl, showSnackbar } from "../utils.js";

const params = new URLSearchParams(window.location.search);
const blogId = params.get("blogId");
const API_URL = `${getApiUrl()}/posts`;

const token = localStorage.getItem("authToken");
const userIds = await getUserIds();
injectAuthorIds(userIds);

if (blogId) {
    await preloadData(blogId);
    document.getElementById("heading").textContent = "Update Blog";
    document.getElementById("submit-btn").textContent = "Save changes";
    document.title = "Admin | Edit Blog";
}

const titleElement = document.getElementById("title");
const slugElement = document.getElementById("slug");

titleElement.addEventListener("input", () => {
    slugElement.value = slugify(titleElement.value);
})

document.getElementById("blogForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const blogId = document.getElementById("id").value;
    const blogData = getFormData();
    const requestUrl = blogId ? `${API_URL}/${blogId}` : API_URL;
    const method = blogId ? "PUT" : "POST";

    try {
        const res = await fetch(requestUrl, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(blogData)
        });

        if (res.ok) {
            const snackBarMessage = blogId ? "Blog successfully updated" : "Blog successfully created"
            showSnackbar(snackBarMessage);
        } else {
            const data = await res.json().catch(() => null);

            const message = data?.error || data?.message || res.statusText || "Something went wrong";

            showSnackbar(message);
        }
    } catch (error) {
        showSnackbar(error);
    }
})

function slugify(inputText) {
    if (!inputText) {
        return null
    }
    return inputText
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
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

async function preloadData(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);

        const blog = await res.json();

        document.getElementById("id").value = blog.id;
        document.getElementById("author-id").value = blog.author_id;
        document.getElementById("title").value = blog.title;
        document.getElementById("slug").value = blog.slug;
        document.getElementById("cover_image").value = blog.cover_image;
        document.getElementById("published").value = blog.published ? "published" : "unpublished";
        document.getElementById("content").value = blog.content;

        
    } catch (error) {
        showSnackbar(error);
    }
}

function injectAuthorIds(userData) {
    const authorDropdown = document.getElementById("author-id");
    authorDropdown.innerHTML = `<option value="" selected disabled>Select author...</option>`;
    Object.keys(userData).forEach(key => {
        const authorOption = document.createElement("option");
        authorOption.value = key;
        authorOption.textContent = userData[key];
        authorDropdown.appendChild(authorOption);
    })
}

function getFormData() {
    const formData = {
        author_id: document.getElementById("author-id").value,
        title: document.getElementById("title").value.trim(),
        slug: document.getElementById("slug").value.trim(),
        content: document.getElementById("content").value.trim(),
        cover_image: document.getElementById("cover_image").value.trim(),
        published: document.getElementById("published").value === "published",
    }

    return formData;
}