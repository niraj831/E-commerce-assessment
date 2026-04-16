const API = "https://fakestoreapi.com/products";

let products = [];
let cartCount = 0;

// Fetch Products
async function fetchProducts() {
  try {
    document.getElementById("loader").style.display = "block";

    const res = await fetch(API);
    products = await res.json();

    document.getElementById("loader").style.display = "none";

    renderProducts(products);
    loadCategories(products);

  } catch (error) {
    document.getElementById("loader").innerHTML = "Failed to load products";
  }
}

// Render Products
function renderProducts(data) {
  const container = document.getElementById("products");
  container.innerHTML = "";

  data.forEach(product => {
    container.innerHTML += `
      <div class="col-md-3 mb-4">
        <div class="card p-2">
          <img src="${product.image}" class="card-img-top">
          <div class="card-body">
            <h6>${product.title.slice(0, 40)}</h6>
            <p>₹${product.price}</p>
            <button class="btn btn-primary btn-sm" onclick="showDetails(${product.id})">View</button>
            <button class="btn btn-success btn-sm" onclick="addToCart()">Add</button>
          </div>
        </div>
      </div>
    `;
  });
}

// Categories
function loadCategories(data) {
  const categories = [...new Set(data.map(p => p.category))];
  const dropdown = document.getElementById("category");

  categories.forEach(cat => {
    dropdown.innerHTML += `<option value="${cat}">${cat}</option>`;
  });
}

// Filter
document.getElementById("category").addEventListener("change", (e) => {
  let value = e.target.value;
  let filtered = value === "all" ? products : products.filter(p => p.category === value);
  renderProducts(filtered);
});

// Search
document.getElementById("search").addEventListener("input", (e) => {
  let search = e.target.value.toLowerCase();
  let filtered = products.filter(p => p.title.toLowerCase().includes(search));
  renderProducts(filtered);
});

// Sort
document.getElementById("sort").addEventListener("change", (e) => {
  let value = e.target.value;
  let sorted = [...products];

  if (value === "low") sorted.sort((a, b) => a.price - b.price);
  if (value === "high") sorted.sort((a, b) => b.price - a.price);

  renderProducts(sorted);
});

// Product Details Modal
function showDetails(id) {
  let product = products.find(p => p.id === id);

  document.getElementById("modal-content").innerHTML = `
    <div class="modal-header">
      <h5>${product.title}</h5>
      <button class="btn-close" data-bs-dismiss="modal"></button>
    </div>
    <div class="modal-body">
      <img src="${product.image}" class="img-fluid mb-3">
      <p>${product.description}</p>
      <p><b>Price:</b> ₹${product.price}</p>
      <p><b>Rating:</b> ${product.rating.rate}</p>
    </div>
  `;

  new bootstrap.Modal(document.getElementById("productModal")).show();
}

// Cart
function addToCart() {
  cartCount++;
  document.getElementById("cart-count").innerText = cartCount;
}

// Init
fetchProducts();