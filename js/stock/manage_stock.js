import { getApiUrl, showSnackbar } from "../utils.js";

const params = new URLSearchParams(window.location.search);
const stockId = params.get("stockId");

const API_URL = getApiUrl() + "/stock";
const token = localStorage.getItem("authToken");

// DOM ELEMENTS
const stockForm = document.getElementById("stockForm");
const stockIdInput = document.getElementById("stock_id");
const stockNameInput = document.getElementById("stock_name");
const categoryDropdown = document.getElementById("category_id");
const quantityInput = document.getElementById("quantity");
const imageUrlInput = document.getElementById("image_url");

const categories = await getCategories();
injectCategoryIds(categories);

if (stockId) {
    await preloadData(stockId);
    document.getElementById("heading").textContent = "Update Stock";
    document.getElementById("submit-btn").textContent = "Save changes";
    document.title = "Admin | Edit Stock Item";
}

stockForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    createUpdateStock();
})

async function getCategories() {
    try {
        const res = await fetch(`${getApiUrl()}/categories`);
        const categories = await res.json();

        if (categories.length === 0) {
            return;
        }

        const returnObject = {};
        categories.forEach((category) => {
            returnObject[category.id] = category.name;
        });

        console.log(JSON.stringify(returnObject));
        return returnObject;
    } catch (error) {
        showSnackbar(error);
    }
}

function injectCategoryIds(categories) {
    categoryDropdown.innerHTML = `<option value="" selected disabled>Select category...</option>`

    Object.keys(categories).forEach(key => {
        const categoryOption = document.createElement("option");
        categoryOption.value = key;
        categoryOption.textContent = categories[key];
        categoryDropdown.appendChild(categoryOption);
    })
}

async function preloadData(stockId) {
    try {
        const res = await fetch(`${API_URL}/${stockId}`);

        if (!res.ok) {
            showSnackbar("Stock item not found");
            return;
        }

        const stockItem = await res.json();

        stockIdInput.value = stockItem.id;
        stockNameInput.value = stockItem.name;
        categoryDropdown.value = stockItem.category_id;
        quantityInput.value = stockItem.quantity;
        imageUrlInput.value = stockItem.image;
    } catch (error) {
        showSnackbar(error);
    }
}

async function createUpdateStock() {
    const stockId = stockIdInput.value;
    const method = stockId ? "PUT" : "POST";
    const requestUrl = stockId ? `${API_URL}/${stockId}` : API_URL;

    const stockData = getFormData();

    try {
        const res = await fetch(requestUrl, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(stockData)
        });

        if (res.ok) {
            const snackBarMessage = stockId ? "Stock item successfully update" : "Stock item successfully created";
            showSnackbar(snackBarMessage);
        }
    } catch (error) {
        showSnackbar(error);
    }
}

function getFormData() {
    return {
        "name": stockNameInput.value,
        "category_id": categoryDropdown.value,
        "quantity": quantityInput.value,
        "image": imageUrlInput.value
    };
}