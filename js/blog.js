document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("posts-container");

  try {
    const response = await fetch("https://izg-backend.onrender.com/api/posts");
    const posts = await response.json();

    posts.forEach(post => {
      if (!post.published) return;

      const card = document.createElement("a");
      card.href = `/blog/${post.slug}`;
      card.className = "blog-card";

      card.innerHTML = `
        <img src="${post.cover_image || '/default-cover.jpg'}" alt="${post.title}" />
        <div class="content">
          <h2 class="title">${post.title}</h2>
          <p class="date">${new Date(post.published_at).toLocaleDateString()}</p>
        </div>
      `;

      container.appendChild(card);
    });

    if (posts.length === 0) {
      container.innerHTML = "<p>No blog posts available.</p>";
    }
  } catch (err) {
    container.innerHTML = "<p>Failed to load posts. Please try again later.</p>";
    console.error(err);
  }
});
