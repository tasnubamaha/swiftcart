const BASE_URL = "https://fakestoreapi.com";

let cart = [];
let allProducts = [];   
let visibleCount = 3;  

cart = JSON.parse(localStorage.getItem("cart")) || [];
updateCartCount();


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
  allProducts = await res.json(); 
  visibleCount = 3; 
  displayProducts();

  showLoader(false);
}

// Load products by category
async function loadProductsByCategory(category){
  showLoader(true);

  const res = await fetch(`${BASE_URL}/products/category/${category}`);
  allProducts = await res.json();

  visibleCount = 3; 
  displayProducts();

  showLoader(false);
}


// Display products
function displayProducts(){
  const container = document.getElementById("products");
  container.innerHTML = "";

  // show only limited products
  const productsToShow = allProducts.slice(0, visibleCount);

  productsToShow.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <div class="product-img">
        <img src="${product.image}" />
      </div>
      <div class="product-info">
        <span class="category">${product.category}</span>
        <span class="rating"><i class="fa-solid fa-star"></i> ${product.rating.rate} (${product.rating.count})</span>
        <h3>${product.title.slice(0,30)}...</h3>
        <p class="price">$${product.price}</p>
        <div class="product-btns">
          <button onclick="openProductDetails(${product.id})" class="details"><i class="fa-solid fa-eye"></i> Details</button>
          <button onclick="addToCart(${product.id})" class="add"><i class="fa-solid fa-cart-arrow-down"></i> Add</button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  // hide button if all shown
  document.getElementById("loadMoreBtn").style.display =
    visibleCount >= allProducts.length ? "none" : "inline-block";
}


// Show product details in modal
// async function showDetails(id){
//   const res = await fetch(`${BASE_URL}/products/${id}`);
//   const product = await res.json();

//   const modal = document.getElementById("modal");
//   const body = document.getElementById("modal-body");

//   body.innerHTML = `
//     <h2>${product.title}</h2>
//     <img src="${product.image}" width="200"/>
//     <p>${product.description}</p>
//     <h3>$${product.price}</h3>
//     <p>⭐ ${product.rating.rate}</p>
//     <button onclick="addToCart(${product.id})">Buy Now</button>
//   `;

//   modal.classList.remove("hidden");
// }

// Close modal
document.getElementById("close-modal").onclick = () => {
  document.getElementById("modal").classList.add("hidden");
};

// Cart functions
async function addToCart(id){

  const res = await fetch(`${BASE_URL}/products/${id}`);
  const product = await res.json();

  cart.push(product);

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
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
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  loadCategories();
  loadAllProducts();
});



document.getElementById("loadMoreBtn").onclick = () => {
  visibleCount += 3; 
  displayProducts();
};


function checkout(){

  if(cart.length === 0){
    alert("🛒 Your cart is empty!");
    return;
  }

  alert("✅ Order placed successfully!");

  cart = [];
  localStorage.removeItem("cart");
  updateCartCount();
}



// MODAL

const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const closeModal = document.getElementById("close-modal");


async function openProductDetails(id){

  modal.classList.remove("hidden");
  modalBody.innerHTML = "<p>Loading...</p>";

  try{
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    const product = await res.json();

    modalBody.innerHTML = `
      <div class="modal-product">

        <img src="${product.image}" alt="${product.title}">

        <div class="modal-info">
          <h2>${product.title}</h2>

          <p>${product.description}</p>

          <p>⭐ ${product.rating.rate} (${product.rating.count} reviews)</p>

          <div class="modal-price">$${product.price}</div>

          <button class="add" onclick="addToCart(${product.id})">
            🛒 Add To Cart
          </button>

        </div>
      </div>
    `;

  }catch(err){
    modalBody.innerHTML = "<p>Failed to load product.</p>";
  }
}


document.addEventListener("DOMContentLoaded", () => {

  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  const closeModal = document.getElementById("close-modal");

  closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });

});
