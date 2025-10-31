import { getApiUrl, showSnackbar, showConfirmationDialog } from "../utils.js";

const API_URL = getApiUrl() + "/stock";
const token = localStorage.getItem("authToken");

// Fetch stock items
export async function fetchStockItems() {
  try {
    const res = await fetch(API_URL);
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch stocks:", err);
    return [];
  }
}

// Create skeleton placeholders
function showSkeleton(count = 6) {
  const container = document.getElementById("stock-container");
  container.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement("div");
    skeleton.className = "skeleton";
    container.appendChild(skeleton);
  }
}

// Render stock cards on screen
export function loadStockCards(stocks) {
  const container = document.getElementById("stock-container");
  container.innerHTML = "";

  stocks.forEach(stock => {
    const card = document.createElement("div");
    const stockImage = stock.image ? stock.image : "https://www.sosproducts.com/v/vspfiles/photos/350237-2.jpg?v-cache=1733143537";
    card.className = "stock-card";

    card.innerHTML = `
      <img src="${stockImage}" alt="${stock.name}" />
      <div class="card-title">${stock.name}</div>
      <div class="card-category">${stock.category_name}</div>

      <div class="quantity-controls">
        <button class="decrease">-</button>
        <span>${stock.quantity}</span>
        <button class="increase">+</button>
      </div>

      <div class="card-actions">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn btn-primary">Delete</button>
      </div>
    `;

    // Quantity Buttons
    card.querySelector(".increase").addEventListener("click", () =>
      updateQuantity(stock, stock.quantity + 1, card)
    );

    card.querySelector(".decrease").addEventListener("click", () =>
      updateQuantity(stock, stock.quantity - 1, card)
    );

    // Edit Button
    card.querySelector(".edit-btn").addEventListener("click", () => {
      window.location.href = `/admin/manage_stock.html?stockId=${stock.id}`;
    });

    // Delete Button
    card.querySelector(".delete-btn").addEventListener("click", () =>
      deleteStock(stock.id, card)
    );

    container.appendChild(card);
  });
}

// PATCH Quantity
async function updateQuantity(stock, newQty, card) {
  console.log("Updating...");
  console.log(`New qty: ${newQty}`);
  if (newQty < 0) return;

  try {
    const res = await fetch(`${API_URL}/${stock.id}`, {
        method: "PATCH",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: newQty })
    });

    if (res.ok) {
        card.querySelector(".quantity-controls span").textContent = newQty;
        stock.quantity = newQty;
    }
    
  } catch (err) {
    console.error("Failed to update quantity:", err);
  }
}

// DELETE Stock
async function deleteStock(id, cardElement) {
  const confirmed = await showConfirmationDialog("Delete Stock Item", "Are you sure you want to delete stock item? This action cannot be undone.", "Cancel", "Delete");

  if (!confirmed) {
    return;
  }

  try {
    const res = await fetch(`${API_URL}/${id}`, { 
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (res.ok) {
        cardElement.remove();
        showSnackbar("Stock item successfully deleted.")
    }
    
  } catch (err) {
    console.error("Failed to delete stock:", err);
  }
}

// INIT
document.addEventListener("DOMContentLoaded", async () => {
  showSkeleton();
  const stocks = await fetchStockItems();
  loadStockCards(stocks);
});
