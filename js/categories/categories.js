import { getApiUrl, showConfirmationDialog, showSnackbar } from "../utils.js";

const API_URL = `${getApiUrl()}/categories`;
const token = localStorage.getItem("authToken");

document.addEventListener("DOMContentLoaded", loadCategories);

document.getElementById("createCategoryBtn").addEventListener("click", () => {
    renderCategoryCard({ id: null, name: "" }, true);
});

async function loadCategories() {
    console.log("Entered")
    const res = await fetch(API_URL);
    const data = await res.json();

    // console.log(JSON.stringify(data));

    const container = document.getElementById("categoriesContainer");
    container.innerHTML = "";
    data.forEach(cat => renderCategoryCard(cat));
}

function renderCategoryCard(category, isNew = false) {
    const container = document.getElementById("categoriesContainer");

    const card = document.createElement("div");
    card.className = "category-card";

    const input = document.createElement("input");
    input.type = "text";
    input.value = category.name;

    const nameDisplay = document.createElement("div");
    nameDisplay.className = "category-name";
    nameDisplay.textContent = category.name;

    const actions = document.createElement("div");
    actions.className = "actions";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "btn-secondary";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "btn-primary";

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.className = "btn-primary";

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.className = "btn-secondary";

    function showViewMode() {
        card.innerHTML = "";
        card.appendChild(nameDisplay);
        actions.innerHTML = "";
        actions.appendChild(editBtn);
        if (!isNew) actions.appendChild(deleteBtn);
        card.appendChild(actions);
    }

    function showEditMode() {
        card.innerHTML = "";
        card.appendChild(input);
        actions.innerHTML = "";
        actions.appendChild(cancelBtn);
        actions.appendChild(saveBtn);
        card.appendChild(actions);
    }

    editBtn.onclick = () => showEditMode();
    cancelBtn.onclick = () => {
        if (isNew) card.remove(); else showViewMode();
    };

    saveBtn.onclick = async () => {
        const newName = input.value.trim();
        if (!newName) return;

        if (isNew) {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name: newName })
            });
            const newCat = await res.json();

            if (res.ok) {
                category.id = newCat.id;
                category.name = newCat.name;
                nameDisplay.textContent = category.name;

                showSnackbar("Category successfully created");
            }
            
            isNew = false;
            showViewMode();
        } else {
            console.log("Updating...");
            console.log(`Old name: ${category.name}`);
            console.log(`New name: ${newName}\n`);
            console.log(`Url: ${API_URL}/${category.id}`);
            console.log(`Body: ${JSON.stringify({ name: newName })}`);
            const res = await fetch(`${API_URL}/${category.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name: newName })
            });

            if (res.ok) {
                category.name = newName;
                nameDisplay.textContent = newName;
                showSnackbar("Category successfully updated");
            }

            showViewMode();
        }
    };

    deleteBtn.onclick = async () => {
        const confirmed = await showConfirmationDialog("Delete category", "Are sure you want to delete category? This action cannot be undone", "Cancel", "Delete");
        
        if (!confirmed) {
            return;
        }

        const res = await fetch(`${API_URL}/${category.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
            card.remove();
            showSnackbar("Category successfully deleted");
        }
    };

    if (isNew) showEditMode(); else showViewMode();
    container.appendChild(card);
}
