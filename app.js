
// burger
let burger = document.getElementById("burger");
let navLinks = document.querySelector(".nav-links");

burger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  burger.classList.toggle("active");
});

let categoriesSection = document.getElementById("categories");
let productsSection = document.getElementById("products");


// fetch categories
fetch("https://restaurant.stepprojects.ge/api/Categories/GetAll")
  .then((res) => res.json())
  .then((categories) => {
    categories.forEach((category) => {
      categoriesSection.innerHTML += `
        <button class="category-btn">${category.name}</button>
      `;
    });
  });



// fetch products
fetch("https://restaurant.stepprojects.ge/api/Products/GetAll")
  .then((res) => res.json())
  .then((products) => {
    products.forEach((product) => {
      productsSection.innerHTML += `
        <div class="product-card">
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p class="price">${product.price} ₾</p>
          <button class="btn-add">Add to Cart</button>
        </div>
      `;
    });
  });



// slider > es kargad ar mushaobs

// let images = [
//   "images/restaurant.jpg",
//   "images/restaurant6.webp",
//   "images/restaurant4.jpg",
//   "images/restaurant7.jpg",
//   "images/restaurant4.jpg",
//  " images/restaurant7.webp"
// ];

// let mainImage = document.getElementById("mainImage");
// let current = 0;

// function showImage(index) {
//   mainImage.src = images[index];
// }

// document.getElementById("next").addEventListener("click", function(){
//   current++;
//   if(current >= images.length) current = 0;
//   showImage(current);
// });

// document.getElementById("prev").addEventListener("click", function(){
//   current--;
//   if(current < 0) current = images.length - 1;
//   showImage(current);
// });

// auto-slide every 5 seconds
// setInterval(function() {
//   current++;
//   if(current >= images.length) current = 0;
//   showImage(current);
// }, 5000);






// slider 1 > es uket mushaobs

let images = [
  "images/restaurant.jpg",
  "images/restaurant6.webp",
  "images/restaurant4.jpg",
  "images/restaurant7.jpg",
  "images/restaurant4.jpg",
  "images/restaurant7.webp"
];

let mainImage = document.getElementById("mainImage");
let current = 0;
let sliderInterval;


function showImage(index) {
  mainImage.src = images[index];
}

// start auto slide
function startAutoSlide() {
  sliderInterval = setInterval(() => {
    current++;
    if (current >= images.length) current = 0;
    showImage(current);
  }, 5000);
}

// stop auto slide
function stopAutoSlide() {
  clearInterval(sliderInterval);
}

// next
document.getElementById("next").addEventListener("click", () => {
  stopAutoSlide();
  current++;
  if (current >= images.length) current = 0;
  showImage(current);
  startAutoSlide();
});

// prev
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
  "images/restaurant11.jpg"
];

let mainImageContainer = document.getElementById("mainImageContainer");
let thumbs = document.querySelectorAll(".thumbnails div");

function showGalleryImage(index) {
  mainImageContainer.style.backgroundImage = `url(${galleryImages[index]})`;

  thumbs.forEach(t => t.classList.remove("active"));
  thumbs[index].classList.add("active");
}

thumbs.forEach((thumb, index) => {
  thumb.style.backgroundImage = `url(${galleryImages[index]})`;
  thumb.onclick = () => showGalleryImage(index);
});

showGalleryImage(0);









