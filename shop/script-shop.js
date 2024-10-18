let cart = {};
let selectedPaymentMethod = null;

function changeQuantity(button, delta) {
  const card = button.closest(".card");
  const itemName = card.getAttribute("data-name");
  const price = parseFloat(card.getAttribute("data-price"));

  if (!cart[itemName]) {
    cart[itemName] = { price: price, quantity: 0 };
  }

  cart[itemName].quantity += delta;

  if (cart[itemName].quantity < 0) {
    cart[itemName].quantity = 0;
  }

  card.querySelector(".quantity-circle").innerText = cart[itemName].quantity;
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";

  let total = 0;
  for (const item in cart) {
    if (cart[item].quantity > 0) {
      const itemTotal = cart[item].price * cart[item].quantity;
      total += itemTotal;
      cartItems.innerHTML += `
                        <div>
                            ${item} - $${cart[item].price} x ${
        cart[item].quantity
      } = $${itemTotal.toFixed(2)}
                            <button onclick="removeFromCart('${item}')">Remove</button>
                        </div>
                    `;
    }
  }
  document.getElementById("cart-total").innerText = `Total: $${total.toFixed(
    2
  )}`;
}

function removeFromCart(itemName) {
  delete cart[itemName];
  updateCart();
}

function checkout() {
  if (Object.keys(cart).length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const items = Object.keys(cart)
    .filter((item) => cart[item].quantity > 0)
    .map((item) => `${item} x ${cart[item].quantity}`)
    .join("\n");

  const total = Object.values(cart).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  document.getElementById(
    "modal-text"
  ).innerText = `Proceeding to checkout:\n${items}\nTotal: $${total.toFixed(
    2
  )}`;
  document.getElementById("purchaseModal").style.display = "block";
  document.body.classList.add("modal-open");
}

function selectPaymentMethod(method) {
  const buttons = document.querySelectorAll(".payment-button");
  buttons.forEach((button) => {
    button.classList.remove("selected");
  });

  selectedPaymentMethod = method;

  const selectedButton = Array.from(buttons).find(
    (button) => button.getAttribute("data-method") === method
  );
  if (selectedButton) {
    selectedButton.classList.add("selected");
  }
}

function confirmPurchase() {
  if (!selectedPaymentMethod) {
    alert("Please select a payment method before confirming the purchase.");
    return;
  }

  cart = {};
  updateCart();
  resetQuantities();
  closeModal();
  showSuccessModal();
  alert(`Purchase confirmed with ${selectedPaymentMethod}.`);
}

function showSuccessModal() {
  document.getElementById("purchaseSuccessModal").style.display = "block";
  document.body.classList.add("modal-open");
}

function closeSuccessModal() {
  document.getElementById("purchaseSuccessModal").style.display = "none";
  document.body.classList.remove("modal-open");
}

function closeModal() {
  document.getElementById("purchaseModal").style.display = "none";
  resetPaymentSelection();
}

function resetPaymentSelection() {
  if (selectedPaymentMethod) {
    const previousButton = document.querySelector(
      `[data-method="${selectedPaymentMethod}"]`
    );
    if (previousButton) {
      previousButton.classList.remove("selected");
    }
    selectedPaymentMethod = null; // Reset selection
  }
}

function resetQuantities() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    const itemName = card.getAttribute("data-name");
    if (cart[itemName]) {
      cart[itemName].quantity = 0;
    }
    card.querySelector(".quantity-circle").innerText = 0;
  });
}
