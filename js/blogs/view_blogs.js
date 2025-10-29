const { getApiUrl, showSnackbar, showConfirmationDialog } = require("../utils.js");

const API_URL = `${getApiUrl()}/posts`;
const token = localStorage.getItem("authToken");

const tableBody = document.getElementById("tableBody");

await loadBlogPosts();

async function loadBlogPosts() {
    try {
        const res = fetch(API_URL);

        const blogs = await res.json();
        tableBody.innerHTML = "";

        if (blogs.length === 0) {
            tableBody.innerHTML = "No blogs found.";
            return
        }

        blogs.forEach((blogPost) => {
            const tableRow = document.createElement("tr");
            tableRow.innerHTML = `
                <td>${blogPost.id}</td>
                <td>${blogPost.first_name}</td>
                <td>${blogPost.title}</td>
                <td>${blogPost.slug}</td>
                <td>${blogPost.content}</td>
                <td>${blogPost.cover_image}</td>
                <td>${blogPost.published ? blogPost.published_at : "Not published"}</td>
                <td>
                    <button onclick="editBlog(${blogPost.id})" class="btn-secondary">Edit</button>
                    <button onclick="publishBlog(${blogPost.id}, ${blogPost.published})" class="btn">${blogPost.published ? "Unpublish" : "Publish"}</button>
                    <button onclick="deleteBlog(${blogPost.id})" class="btn-primary delete">Edit</button>
                </td>
            `;

            tableBody.appendChild(tableRow);
        })

    } catch (error) {
        
    }
}

function editBlog(id) {
    window.location.href = `/admin/manage_blog.html?blogId=${id}`;
}

async function deleteBlog(id) {
    const confirmed = await showConfirmationDialog("Delete Blog Post", "Are you sure you want to delete blog post, this action cannot be undone!", "Cancel", "Delete");

    if (confirmed) {
        try {
            const res = fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.ok) {
                showSnackbar("Blog post successfully deleted");
            } else {
                const data = await res.json().catch(() => null);

                const message = data?.error || data?.message || res.statusText || "Something went wrong";

                showSnackbar(message);
            }
        } catch (error) {
            showSnackbar(error);
        }
    }
}

async function publishBlog(id, published) {
    const endpoint = published ? "unpublish" : "publish";
    const requestUrl = `${API_URL}/${endpoint}/${id}`;

    try {
        const res = await fetch(requestUrl, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (res.ok) {
            const snackbarMessage = published ? "Blog post successfully unpublished" : "Blog post successfully published";
            showSnackbar(snackbarMessage);
        } else {
            const data = await res.json().catch(() => null);

            const message = data?.error || data?.message || res.statusText || "Something went wrong";

            showSnackbar(message);
        }
    } catch (error) {
        showSnackbar(error);
    }
}

window.editBlog = editBlog;
window.deleteBlog = deleteBlog;
window.publishBlog = publishBlog;