const BASE_URL = "https://fakestoreapi.com";
let cart = [];

// Load all categories
async function loadCategories() {
  const res = await fetch(`${BASE_URL}/products/categories`);
  const categories = await res.json();

  const container = document.getElementById("categories");
  container.innerHTML = "";

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.innerText = cat;
    btn.onclick = () => {
      document.querySelectorAll("#categories button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      loadProductsByCategory(cat);
    };
    container.appendChild(btn);
  });
}

// Load all products (default)
async function loadAllProducts() {
  showLoader(true);
  const res = await fetch(`${BASE_URL}/products`);
  const products = await res.json();
  displayProducts(products);
  showLoader(false);
}

// Load products by category
async function loadProductsByCategory(category){
  showLoader(true);
  const res = await fetch(`${BASE_URL}/products/category/${category}`);
  const products = await res.json();
  displayProducts(products);
  showLoader(false);
}

// Display products
function displayProducts(products){
  const container = document.getElementById("products");
  container.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <div class="product-img">
        <img src="${product.image}" />
      </div>
      <div class="product-info">
        <span class="category">${product.category}</span>
        <span class="rating">⭐ ${product.rating.rate}</span>
        <h4>${product.title.slice(0,40)}...</h4>
        <p class="price">$${product.price}</p>
        <div class="product-btns">
          <button onclick="showDetails(${product.id})" class="details">👁 Details</button>
          <button onclick='addToCart(${JSON.stringify(product)})' class="add">🛒 Add</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Show product details in modal
async function showDetails(id){
  const res = await fetch(`${BASE_URL}/products/${id}`);
  const product = await res.json();

  const modal = document.getElementById("modal");
  const body = document.getElementById("modal-body");

  body.innerHTML = `
    <h2>${product.title}</h2>
    <img src="${product.image}" width="200"/>
    <p>${product.description}</p>
    <h3>$${product.price}</h3>
    <p>⭐ ${product.rating.rate}</p>
    <button onclick='addToCart(${JSON.stringify(product)})'>Buy Now</button>
  `;

  modal.classList.remove("hidden");
}

// Close modal
document.getElementById("close-modal").onclick = () => {
  document.getElementById("modal").classList.add("hidden");
};

// Cart functions
function addToCart(product){
  cart.push(product);
  updateCartCount();
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount(){
  document.getElementById("cart-count").innerText = cart.length;
}

// Loader
function showLoader(state){
  document.getElementById("loader").style.display = state ? "block" : "none";
}

// Shop Now button scroll
function shopNow(){
  window.scrollTo({
    top: document.querySelector(".products-section").offsetTop,
    behavior: "smooth"
  });
}

// Initialize
loadCategories();
loadAllProducts();
