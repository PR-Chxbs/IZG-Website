const API_BASE = "https://izg-backend.onrender.com/api";
const app = document.getElementById("app");
const defaultImageUrl = 'https://plus.unsplash.com/premium_photo-1684581214880-2043e5bc8b8b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YmxvZyUyMGNvdmVyfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000';

// Hash router setup
window.addEventListener("hashchange", router);
window.addEventListener("load", router);

async function router() {
  const hash = window.location.hash.slice(1); // Remove #
  if (!hash || hash === "home") {
    renderBlogList();
  } else if (hash.startsWith("post/")) {
    const slug = hash.split("/")[1];
    renderSinglePost(slug);
  } else {
    renderNotFound();
  }
}

// Fetch all published blogs
async function fetchBlogs() {
  const res = await fetch(`${API_BASE}/posts`);
  const data = await res.json();
  return data.filter(post => post.published);
}

// Fetch single blog post
async function fetchBlogBySlug(slug) {
  const res = await fetch(`${API_BASE}/posts/slug/${slug}`);
  return await res.json();
}

// Render all blogs
async function renderBlogList() {
  document.title = "IZG Blog";
  // Show skeletons while loading
  app.innerHTML = `
    <h1 class="heading">Welcome to our blog</h1>
    <div class="blog-skeletons">
      ${Array(6).fill(0).map(() => `
        <div class="blog-skeleton-card">
          <div class="skeleton blog-skeleton-img"></div>
          <div class="blog-skeleton-content">
            <div class="skeleton blog-skeleton-title"></div>
            <div class="skeleton blog-skeleton-text"></div>
            <div class="skeleton blog-skeleton-text" style="width: 60%;"></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  try {
    const blogs = await fetchBlogs();
    if (!blogs.length) {
      app.innerHTML = `<p>No published blogs found.</p>`;
      return;
    }

    const html = `
      <h1 class="heading">Welcome to our blog</h1>
      <div class="blog-list">
        ${blogs.map(blog => `
          <div class="blog-card" onclick="location.hash='post/${blog.slug}'">
            <img src="${blog.cover_image ? blog.cover_image : defaultImageUrl }" alt="${blog.title}">
            <div class="blog-card-content">
              <p>By ${blog.first_name}</p>
              <h3>${blog.title}</h3>
              <p>${truncate(blog.content, 100)}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    fadeIn(app, html);
  } catch (err) {
    app.innerHTML = `<p>Error loading blogs.</p>`;
  }
}

// Render single blog
async function renderSinglePost(slug) {
  // Show skeleton while loading
  app.innerHTML = `
    <div class="blog-post-skeleton">
      <div class="skeleton blog-skeleton-cover"></div>
      <div class="skeleton blog-skeleton-title"></div>
      <div class="skeleton blog-skeleton-author"></div>
      ${Array(8).fill(0).map(() => `<div class="skeleton blog-skeleton-paragraph"></div>`).join('')}
    </div>
  `;

  try {
    const post = await fetchBlogBySlug(slug);

    document.title = post.title;

    const html = `
      <div class="blog-post">
        <a href="#home" class="back-btn">← Back to all posts</a>
        <img src="${post.cover_image ? post.cover_image : defaultImageUrl }" alt="${post.title}">
        <h2>${post.title}</h2>
        <p><strong>By ${post.first_name}</strong></p>
        <p>${post.content}</p>
      </div>
    `;
    // Add a fade transition between skeleton and actual content
    fadeIn(app, html);
  } catch (err) {
    app.innerHTML = `<p>Failed to load post.</p>`;
  }
}

// Render 404
function renderNotFound() {
  app.innerHTML = `
    <div style="text-align:center;padding:40px;">
      <h2>404 - Page Not Found</h2>
      <a href="#home">Go back home</a>
    </div>
  `;
}

// Helper to shorten text
function truncate(str, n) {
  return str.length > n ? str.slice(0, n) + "..." : str;
}

// Smooth fade-in transition between skeleton and loaded content
function fadeIn(container, newHTML) {
  container.style.opacity = 0;
  setTimeout(() => {
    container.innerHTML = newHTML;
    container.style.transition = "opacity 0.25s ease";
    container.style.opacity = 1;
  }, 150);
}