(() => {
  "use strict";
  const CART_KEY = "campuscafe_cart";
  const money = value => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(value) || 0);
  const $ = id => document.getElementById(id);
  let cart = [];
  let subtotal = 0;
  let discount = 0;
  let promoApplied = false;

  function readCart() {
    try {
      const data = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      return Array.isArray(data) ? data.filter(row => row && typeof row.id === "string" && Number(row.qty) > 0)
        .map(row => ({ id: row.id, qty: Math.floor(Number(row.qty)) })) : [];
    } catch { return []; }
  }
  function getItem(id) { return window.MENU_ITEMS.find(item => item.id === id); }
  function calculateSubtotal() {
    return cart.reduce((sum, row) => {
      const item = getItem(row.id);
      return sum + (item ? Number(item.price) * row.qty : 0);
    }, 0);
  }
  function render() {
    cart = cart.filter(row => getItem(row.id));
    subtotal = calculateSubtotal();
    $("checkout-list").innerHTML = cart.map(row => {
      const item = getItem(row.id);
      return `<li class="checkout-line"><span>${item.name} <small>× ${row.qty}</small></span><strong>${money(item.price * row.qty)}</strong></li>`;
    }).join("");
    $("checkout-empty").hidden = cart.length > 0;
    $("checkout-subtotal").textContent = money(subtotal);
    $("discount-amount").textContent = "−" + money(discount);
    $("grand-total").textContent = money(Math.max(0, subtotal - discount));
    $("apply-promo").disabled = cart.length === 0;
    $("order-form").querySelector('[type="submit"]').disabled = cart.length === 0;
  }
  function resetDiscount() {
    discount = 0;
    promoApplied = false;
    $("promo-message").textContent = "";
    $("promo-message").className = "message";
    render();
  }
  $("apply-promo").addEventListener("click", () => {
    const code = $("promo-code").value.trim().toUpperCase();
    discount = 0;
    promoApplied = false;
    if (!code) {
      $("promo-message").textContent = "Please enter a promo code.";
      $("promo-message").className = "message error";
    } else if (code !== "STUDENT15") {
      $("promo-message").textContent = "Invalid promo code. Please check the code and try again.";
      $("promo-message").className = "message error";
    } else if (subtotal < 150) {
      $("promo-message").textContent = "STUDENT15 is available on orders of ₹150 or more.";
      $("promo-message").className = "message error";
    } else {
      discount = Number((subtotal * 0.15).toFixed(2));
      promoApplied = true;
      $("promo-message").textContent = "Promo applied! You saved " + money(discount) + ".";
      $("promo-message").className = "message success";
    }
    render();
  });
  $("promo-code").addEventListener("input", () => {
    if (promoApplied) resetDiscount();
    else {
      $("promo-message").textContent = "";
      $("promo-message").className = "message";
    }
  });
  $("order-form").addEventListener("submit", event => {
    event.preventDefault();
    $("form-message").textContent = "";
    if (!cart.length || subtotal <= 0) {
      $("form-message").textContent = "Your cart is empty. Please return to the menu and add an item.";
      return;
    }
    const fullName = $("full-name").value.trim();
    const rollNumber = $("roll-number").value.trim();
    if (!fullName || !rollNumber) {
      $("form-message").textContent = "Please enter both your Full Name and Roll Number to confirm your order.";
      (!fullName ? $("full-name") : $("roll-number")).focus();
      return;
    }
    // Revalidate the promo at submission in case the cart data changed.
    if (promoApplied && (subtotal < 150 || $("promo-code").value.trim().toUpperCase() !== "STUDENT15")) {
      discount = 0;
      promoApplied = false;
      render();
    }
    const orderId = "CC" + Date.now().toString().slice(-8) + Math.floor(100 + Math.random() * 900);
    const total = Math.max(0, subtotal - discount);
    localStorage.removeItem(CART_KEY);
    cart = [];
    render();
    $("order-form").hidden = true;
    $("confirmation").hidden = false;
    $("confirmation").innerHTML = `<span class="confirmation-icon">✓</span><h2>Order confirmed!</h2><p>Thank you, ${escapeHtml(fullName)}. Your order has been placed successfully.</p><p class="order-id">Order ID: <strong>${orderId}</strong></p><p>Roll Number: ${escapeHtml(rollNumber)}</p><p>Amount to pay: <strong>${money(total)}</strong></p><a class="btn btn-secondary" href="../index.html">Back to CampusCafe</a>`;
  });
  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  }
  cart = readCart();
  render();
})();