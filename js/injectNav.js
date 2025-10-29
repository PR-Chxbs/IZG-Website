const sideNav = document.getElementById('side-nav');

const sideNavHTML = 
        `
        <div class="top-nav-section">
            <img src="../resources/izg_full_color_logo.png" alt="Izandla Ziya Gezana Logo" class="logo"/>
            <ul class="main-nav-items">
                <li>
                    <a class="nav-item" href="/admin">
                        <img src="../resources/icons/home_nav_icon.png" alt="Home Icon"/>
                        <p>Home</p>
                    </a>
                </li>
                <li>
                    <a class="nav-item" href="/admin/users.html">
                        <img src="../resources/icons/users_nav_icon.png" alt="Users Icon" />
                        <p>Users</p>
                    </a>
                </li>
                <li>
                    <a class="nav-item" href="/admin/events.html">
                        <img src="../resources/icons/events_nav_icon.png" alt="Events Icon" />
                        <p>Events</p>
                    </a>
                </li>
                <li>
                    <a class="nav-item" href="/admin/blogs.html">
                        <img src="../resources/icons/resources_nav_icon.png" alt="Blog Icon" />
                        <p>Blog posts</p>
                    </a>
                </li>
                <li>
                    <a class="nav-item" href="/admin/resources.html">
                        <img src="../resources/icons/resources_nav_icon.png" alt="Resources Icon" />
                        <p>Resources</p>
                    </a>
                </li>
                <li>
                    <a class="nav-item" href="/admin/categories.html">
                        <img src="../resources/icons/assignments_nav_icon.png" alt="Categories Icon" />
                        <p>Categories</p>
                    </a>
                </li>
            </ul>
        </div>
        <button class="nav-item logout-btn" onclick="logout()">
            <img src="/resources/icons/settings_nav_icon.png" alt="Settings Icon" />
            <p>Logout</p>
        </button>
        `;

sideNav.innerHTML = sideNavHTML;

const currentPath = window.location.pathname;

function logout() {
    localStorage.removeItem("authToken");
    window.location.href = "/auth/login.html";
}