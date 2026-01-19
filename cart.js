let cartList = document.querySelector(".cart-list");

function getAllBasket() {
  fetch("https://restaurant.stepprojects.ge/api/Baskets/GetAll")
    .then(res => res.json())
    .then(data => {
      cartList.innerHTML = "";
      data.forEach(item => {
        cartList.innerHTML += `
          <li>
            <img src="${item.product.image}" width="80">
            <h3>${item.product.name}</h3>

            <p>
              <button onclick="changeQty(${item.quantity + 1}, ${item.price}, ${item.product.id})">+</button>
              ${item.quantity}
              <button onclick="changeQty(${item.quantity - 1}, ${item.price}, ${item.product.id})">-</button>
            </p>

            <p>Total: ${item.quantity * item.price} ₾</p>

            <button onclick="removeItem(${item.product.id})">❌</button>
          </li>
        `;
      });
    });
}

getAllBasket();

function changeQty(qty, price, id) {
  if (qty < 1) return;

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
