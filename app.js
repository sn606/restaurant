// burger
let burger = document.getElementById("burger");
let navLinks = document.querySelector(".nav-links");

burger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  burger.classList.toggle("active");
});

let categoriesSection = document.getElementById("categories");
let productsSection = document.getElementById("products");

// slider 1
let images = [
  "images/restaurant.jpg",
  "images/restaurant6.webp",
  "images/restaurant4.jpg",
  "images/restaurant7.jpg",
  "images/restaurant9.png",
  "images/restaurant7.webp",
];

let mainImage = document.getElementById("mainImage");
let current = 0;
let sliderInterval;

function showImage(index) {
  mainImage.src = images[index];
}

function startAutoSlide() {
  sliderInterval = setInterval(() => {
    current++;
    if (current >= images.length) current = 0;
    showImage(current);
  }, 5000);
}

function stopAutoSlide() {
  clearInterval(sliderInterval);
}

document.getElementById("next").addEventListener("click", () => {
  stopAutoSlide();
  current++;
  if (current >= images.length) current = 0;
  showImage(current);
  startAutoSlide();
});

document.getElementById("prev").addEventListener("click", () => {
  stopAutoSlide();
  current--;
  if (current < 0) current = images.length - 1;
  showImage(current);
  startAutoSlide();
});

startAutoSlide();

// slider 2
let galleryImages = [
  "images/restaurant5.jpg",
  "images/restaurant8.png",
  "images/restaurant9.png",
  "images/restaurant11.jpg",
];

let mainImageContainer = document.getElementById("mainImageContainer");
let thumbs = document.querySelectorAll(".thumbnails div");

function showGalleryImage(index) {
  mainImageContainer.style.backgroundImage = `url(${galleryImages[index]})`;

  thumbs.forEach((t) => t.classList.remove("active"));
  thumbs[index].classList.add("active");
}

thumbs.forEach((thumb, index) => {
  thumb.style.backgroundImage = `url(${galleryImages[index]})`;
  thumb.onclick = () => showGalleryImage(index);
});

showGalleryImage(0);

// restaurant
let allProducts = [];
let allCategories = [];

let currentFilters = {
  categoryId: "all",
  spiciness: null,
  nuts: null,
  vegeterian: null,
};

// fetch categories
fetch("https://restaurant.stepprojects.ge/api/Categories/GetAll")
  .then((res) => res.json())
  .then((categories) => {
    allCategories = categories;

    categoriesSection.innerHTML = "";

    categoriesSection.innerHTML += `
      <button class="category-btn active" data-category-id="all">All</button>
    `;

    categories.forEach((category) => {
      categoriesSection.innerHTML += `
        <button class="category-btn" data-category-id="${category.id}">${category.name}</button>
      `;
    });

    document.querySelectorAll(".category-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        document
          .querySelectorAll(".category-btn")
          .forEach((b) => b.classList.remove("active"));

        this.classList.add("active");

        let categoryId = this.dataset.categoryId;
        currentFilters.categoryId = categoryId;
        applyAllFilters();
      });
    });
  });

// fetch products
function fetchAllProducts() {
  fetch("https://restaurant.stepprojects.ge/api/Products/GetAll")
    .then((res) => res.json())
    .then((products) => {
      allProducts = products;
      displayProducts(products);
    });
}

// fetch filtered products
function fetchFilteredProducts(filters) {
  let params = new URLSearchParams();

  if (filters.spiciness !== null) {
    params.append("spiciness", filters.spiciness);
  }

  if (filters.nuts !== null) {
    params.append("nuts", filters.nuts.toString());
  }

  if (filters.vegeterian !== null) {
    params.append("vegeterian", filters.vegeterian.toString());
  }

  let url = `https://restaurant.stepprojects.ge/api/Products/GetFiltered?${params.toString()}`;

  return fetch(url)
    .then((res) => res.json())
    .then((products) => {
      return products;
    })
    .catch((error) => {
      console.error("Error loading filtered products:", error);
      return [];
    });
}

// apply all filters
function applyAllFilters() {
  if (
    currentFilters.spiciness === null &&
    currentFilters.nuts === null &&
    currentFilters.vegeterian === null
  ) {
    let filteredProducts = allProducts;

    if (currentFilters.categoryId !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) => product.categoryId == currentFilters.categoryId,
      );
    }

    displayProducts(filteredProducts);
    return;
  }

  fetchFilteredProducts(currentFilters).then((filteredProducts) => {
    if (currentFilters.categoryId !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) => product.categoryId == currentFilters.categoryId,
      );
    }

    displayProducts(filteredProducts);
  });
}

// display products
function displayProducts(products) {
  productsSection.innerHTML = "";

  if (products.length === 0) {
    productsSection.innerHTML =
      '<p class="no-products">No products found matching your filters.</p>';
    return;
  }

  products.forEach((product) => {
    // spiciness indicator
    let spicinessHtml = "";
    if (product.hasOwnProperty("spiciness")) {
      spicinessHtml = `<div class="spiciness-indicator">Spiciness: ${product.spiciness}</div>`;
    }

    // allergen indicators (nigvziani)
    let allergenHtml = "";
    let hasNuts = product.nuts !== undefined ? product.nuts : false;
    let isVegeterian =
      product.vegeterian !== undefined ? product.vegeterian : false;

    allergenHtml = `<div class="allergen-indicators">`;
    if (hasNuts === true || hasNuts === "true") {
      allergenHtml += `<span class="allergen-tag">Nuts</span>`;
    }
    if (isVegeterian === true || isVegeterian === "true") {
      allergenHtml += `<span class="allergen-tag">Vegeterian</span>`;
    }
    allergenHtml += `</div>`;

    productsSection.innerHTML += `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <div class="product-details">
          ${spicinessHtml}
          ${allergenHtml}
        </div>
        <p class="price">$ ${product.price}</p>
        <button class="btn-add" onclick="addToCart(${product.id}, ${product.price})">
          Add to cart
        </button>
      </div>
    `;
  });
}

// add to cart function
function addToCart(id, price) {
  fetch("https://restaurant.stepprojects.ge/api/Baskets/GetAll")
    .then((res) => res.json())
    .then((cartItems) => {
      let existingItem = cartItems.find((item) => item.product.id === id);

      if (existingItem) {
        let newQuantity = existingItem.quantity + 1;

        fetch("https://restaurant.stepprojects.ge/api/Baskets/UpdateBasket", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
          body: JSON.stringify({
            productId: id,
            quantity: newQuantity,
            price: price,
          }),
        })
          .then((res) => res.text())
          .then(() => {
            alert("Added to cart ✅");
          });
      } else {
        let info = {
          productId: id,
          quantity: 1,
          price: price,
        };

        fetch("https://restaurant.stepprojects.ge/api/Baskets/AddToBasket", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "text/plain",
          },
          body: JSON.stringify(info),
        })
          .then((res) => res.text())
          .then(() => {
            alert("Added to cart ✅");
          });
      }
    })
    .catch((error) => {
      console.error("Error checking cart:", error);
      alert("Error adding to cart");
    });
}

// filters
function setupFilters() {
  let spicinessSelect = document.getElementById("spiciness-select");
  let noNutsCheckbox = document.getElementById("noNuts-checkbox");
  let vegetarianCheckbox = document.getElementById("vegetarian-checkbox");
  let resetBtn = document.getElementById("reset-filters");
  let applyBtn = document.getElementById("apply-filters");

  if (applyBtn) {
    applyBtn.addEventListener("click", function () {
      currentFilters.spiciness =
        spicinessSelect.value === "null"
          ? null
          : parseInt(spicinessSelect.value);

      currentFilters.nuts = noNutsCheckbox.checked ? false : null;
      currentFilters.vegeterian = vegetarianCheckbox.checked ? true : null;

      applyAllFilters();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      if (spicinessSelect) spicinessSelect.value = "null";
      if (noNutsCheckbox) noNutsCheckbox.checked = false;
      if (vegetarianCheckbox) vegetarianCheckbox.checked = false;

      currentFilters = {
        categoryId: "all",
        spiciness: null,
        nuts: null,
        vegeterian: null,
      };

      document.querySelectorAll(".category-btn").forEach((btn) => {
        btn.classList.remove("active");
        if (btn.dataset.categoryId === "all") {
          btn.classList.add("active");
        }
      });

      displayProducts(allProducts);
    });
  }
}

//
document.addEventListener("DOMContentLoaded", function () {
  fetchAllProducts();
  setupFilters();
});
