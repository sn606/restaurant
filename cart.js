let cartList = document.querySelector(".cart-list");
let cartTotalAmount = document.getElementById("cartTotalAmount");

function getAllBasket() {
  fetch("https://restaurant.stepprojects.ge/api/Baskets/GetAll")
    .then(res => res.json())
    .then(data => {
      cartList.innerHTML = "";
      
      if (data.length === 0) {
        cartList.innerHTML = `
          <li class="empty-cart-message">
            <div>Your cart is empty</div>
          </li>
        `;
        cartTotalAmount.textContent = "0.00";
        return;
      }
      
      let totalAmount = 0;
      
      data.forEach(item => {
        const itemTotal = item.quantity * item.price;
        totalAmount += itemTotal;
        
        cartList.innerHTML += `
          <li class="cart-item">
            <!-- Product -->
            <div class="cart-item-product">
              <img src="${item.product.image}" alt="${item.product.name}">
              <div>
                <h3>${item.product.name}</h3>
              </div>
            </div>
            
            <!-- Quantity -->
            <div class="cart-item-quantity">
              <div class="quantity-controls">
                <button class="qty-btn" onclick="changeQty(${item.quantity - 1}, ${item.price}, ${item.product.id})">-</button>
                <span class="cart-item-qty">${item.quantity}</span>
                <button class="qty-btn" onclick="changeQty(${item.quantity + 1}, ${item.price}, ${item.product.id})">+</button>
              </div>
            </div>
            
            <!-- Price -->
            <div class="cart-item-price">
              <span>${item.price.toFixed(2)} ₾</span>
            </div>
            
            <!-- Total -->
            <div class="cart-item-total">
              <span>${itemTotal.toFixed(2)} ₾</span>
            </div>
            
            <!-- Action (remove button) -->
            <div class="cart-item-action">
              <button class="remove-btn" onclick="removeItem(${item.product.id})">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </li>
        `;
      });
      
      cartTotalAmount.textContent = totalAmount.toFixed(2);
    });
}

getAllBasket();

function changeQty(qty, price, id) {
  if (qty < 1) {
    removeItem(id);
    return;
  }

  fetch("https://restaurant.stepprojects.ge/api/Baskets/UpdateBasket", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      accept: "*/*"
    },
    body: JSON.stringify({
      productId: id,
      quantity: qty,
      price: price
    })
  }).then(() => getAllBasket());
}

function removeItem(id) {
  fetch(`https://restaurant.stepprojects.ge/api/Baskets/DeleteProduct/${id}`, {
    method: "DELETE",
    headers: { accept: "*/*" }
  }).then(() => getAllBasket());
}


  
  //checkouts rom davachert amova alerti
  const checkoutBtn = document.querySelector('.checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      const total = parseFloat(cartTotalAmount.textContent);
      
      if (total === 0) {
        alert("Your cart is empty!");
        return;
      }
      alert(`Thank you for your order!\nTotal: ${total.toFixed(2)} ₾`);

    });
  }
});