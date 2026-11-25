(() => {
  "use strict";
  const CART_KEY = "campuscafe_cart";
  const money = value => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(value) || 0);
  const icons = {
    coffee: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M13 23h34v19a12 12 0 0 1-12 12h-10a12 12 0 0 1-12-12V23Z" fill="#d99a62"/><path d="M47 28h5a7 7 0 0 1 0 14h-6" fill="none" stroke="#8d5737" stroke-width="5"/><path d="M22 16c-5-6 4-7 0-13M34 16c-5-6 4-7 0-13" fill="none" stroke="#8d5737" stroke-width="3" stroke-linecap="round"/><path d="M9 56h46" stroke="#8d5737" stroke-width="4" stroke-linecap="round"/></svg>',
    cold: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="m20 14 8-8 9 8 8-7 5 7-5 41H19L14 14Z" fill="#c68a55"/><path d="m27 19 5-5 6 5M25 30l5-5m7 18 5-5" stroke="#fff0d8" stroke-width="3" stroke-linecap="round"/><path d="m39 5 9-3" stroke="#6f9b82" stroke-width="3" stroke-linecap="round"/></svg>',
    lemon: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M12 30c7-15 31-20 42-5 5 8-3 24-18 29C20 60 5 45 12 30Z" fill="#f3cf55"/><path d="M30 13c3-7 10-9 16-6-2 7-8 10-16 6Z" fill="#6f9b72"/><path d="M22 32c6-7 17-10 25-6" fill="none" stroke="#fff2a5" stroke-width="4" stroke-linecap="round"/></svg>',
    tea: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M13 23h35v18a12 12 0 0 1-12 12h-11a12 12 0 0 1-12-12V23Z" fill="#c58b58"/><path d="M48 28h5a7 7 0 0 1 0 14h-6" fill="none" stroke="#8d5737" stroke-width="5"/><path d="M22 15c-5-6 4-7 0-13M35 15c-5-6 4-7 0-13" fill="none" stroke="#8d5737" stroke-width="3" stroke-linecap="round"/></svg>',
    sandwich: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M9 28 32 10l23 18-23 9L9 28Z" fill="#e9b66f"/><path d="m9 31 23 10 23-10v8L32 51 9 39v-8Z" fill="#6e9a69"/><path d="m9 40 23 11 23-11v5L32 57 9 45v-5Z" fill="#d88c4b"/></svg>',
    samosa: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M9 46 27 12q5-9 11 0l17 34q4 8-5 8H14q-9 0-5-8Z" fill="#dfa04f"/><path d="M22 42 32 24l10 18" fill="none" stroke="#f7d28c" stroke-width="4" stroke-linecap="round"/></svg>',
    muffin: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 30q-3-17 12-16 8-14 18-2 13-1 8 18l-5 25H19l-5-25Z" fill="#9a6346"/><path d="M18 34h29l-3 17H21l-3-17Z" fill="#d99a62"/><circle cx="27" cy="24" r="3" fill="#f0c48c"/><circle cx="40" cy="20" r="3" fill="#f0c48c"/></svg>',
    fries: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="m17 23 7-15 7 15 7-17 7 17 7-11 5 12-7 29H18L11 24Z" fill="#e7ad4e"/><path d="M18 32h31l-5 20H22l-4-20Z" fill="#d66d4e"/><path d="M25 37v8m9-8v8m8-8v8" stroke="#ffe1a1" stroke-width="3" stroke-linecap="round"/></svg>'
  };
  const menuGrid = document.getElementById("menu-grid");
  const cartList = document.getElementById("cart-list");
  if (!menuGrid || !cartList) return;
  let category = "all";
  let query = "";
  let cart = loadCart();

  function loadCart() {
    try {
      const parsed = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      return Array.isArray(parsed) ? parsed.filter(row => row && typeof row.id === "string" && Number.isFinite(Number(row.qty)) && Number(row.qty) > 0)
        .map(row => ({ id: row.id, qty: Math.floor(Number(row.qty)) })) : [];
    } catch { return []; }
  }
  function saveCart() { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
  function itemFor(id) { return window.MENU_ITEMS.find(item => item.id === id); }
  function renderMenu() {
    const filtered = window.MENU_ITEMS.filter(item =>
      (category === "all" || item.category === category) &&
      item.name.toLowerCase().includes(query)
    );
    menuGrid.innerHTML = filtered.length ? filtered.map(item => `
      <article class="menu-card">
        <div class="product-art">${icons[item.icon] || icons.coffee}<span class="tag">${item.tag}</span></div>
        <div class="product-info"><span class="category-label">${item.category}</span>
          <h3>${item.name}</h3><p>${item.description}</p>
          <div class="product-bottom"><strong>${money(item.price)}</strong>
            <button class="add-btn" type="button" data-add="${item.id}">＋ Add</button>
          </div>
        </div>
      </article>`).join("") : '<p class="no-results">No menu items found. Try another search.</p>';
  }
  function renderCart() {
    cart = cart.filter(row => itemFor(row.id) && row.qty > 0);
    const count = cart.reduce((sum, row) => sum + row.qty, 0);
    const subtotal = cart.reduce((sum, row) => sum + itemFor(row.id).price * row.qty, 0);
    document.getElementById("cart-count").textContent = count;
    document.getElementById("cart-subtotal").textContent = money(subtotal);
    document.getElementById("cart-empty").hidden = cart.length > 0;
    cartList.innerHTML = cart.map(row => {
      const item = itemFor(row.id);
      return `<li class="cart-item"><div class="cart-item-copy"><strong>${item.name}</strong><small>${money(item.price)} each</small></div>
        <div class="quantity-control"><button type="button" data-change="-1" data-id="${item.id}" aria-label="Decrease ${item.name} quantity">−</button><span>${row.qty}</span><button type="button" data-change="1" data-id="${item.id}" aria-label="Increase ${item.name} quantity">＋</button></div>
        <strong class="line-total">${money(item.price * row.qty)}</strong></li>`;
    }).join("");
    saveCart();
  }
  menuGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");
    if (!button) return;
    const id = button.dataset.add;
    const existing = cart.find(row => row.id === id);
    if (existing) existing.qty += 1; else cart.push({ id, qty: 1 });
    document.getElementById("cart-msg").textContent = "";
    renderCart();
    button.textContent = "✓ Added";
    setTimeout(() => { if (button.isConnected) button.textContent = "＋ Add"; }, 700);
  });
  cartList.addEventListener("click", event => {
    const button = event.target.closest("[data-change]");
    if (!button) return;
    const row = cart.find(item => item.id === button.dataset.id);
    if (!row) return;
    row.qty += Number(button.dataset.change);
    if (row.qty <= 0) cart = cart.filter(item => item.id !== row.id);
    renderCart();
  });
  document.querySelectorAll(".filter-btn").forEach(button => button.addEventListener("click", () => {
    category = button.dataset.category;
    document.querySelectorAll(".filter-btn").forEach(btn => {
      const active = btn === button;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
    renderMenu();
  }));
  document.getElementById("search-input").addEventListener("input", event => {
    query = event.target.value.trim().toLowerCase();
    renderMenu();
  });
  document.getElementById("checkout-btn").addEventListener("click", event => {
    if (!cart.length) {
      event.preventDefault();
      const message = document.getElementById("cart-msg");
      message.textContent = "Your cart is empty. Add at least one item before checkout.";
      message.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
  renderMenu();
  renderCart();
})();