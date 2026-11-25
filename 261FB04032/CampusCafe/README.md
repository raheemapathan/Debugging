# CampusCafe

A responsive two-page student food ordering demo built with HTML, CSS and vanilla JavaScript.

## Run the website
1. Extract the `CampusCafe` folder.
2. Open `index.html` in a modern browser. No build step or server is required.
3. Add menu items, adjust quantities, and continue to checkout.
4. Use promo code `STUDENT15` on orders of ₹150 or more.
5. Enter a Full Name and Roll Number to confirm the demo order.

## Project structure
- `index.html` — menu, search, filters and cart
- `pages/checkout.html` — student details, promo code and order confirmation
- `css/main.css` — responsive styling
- `scripts/menuData.js` — menu data and numeric prices
- `scripts/app.js` — menu/cart functionality
- `scripts/checkout.js` — checkout, discount and confirmation logic

Cart data is stored in browser `localStorage` under `campuscafe_cart`. This is a front-end demonstration; it does not process real payments or send orders to a server.

## Reflection
Pasting one HTML file into a standard chat does not reveal the full project context. A website depends on several connected files, folder paths, script load order, shared data and browser storage. Without seeing those files and how they reference one another, an assistant may fix one visible issue while missing broken dependencies elsewhere. Workspace-aware tools can inspect the project tree, search across files, follow references, run or test the application, and make coordinated changes across HTML, CSS and JavaScript. That broader context makes it easier to identify the actual cause of errors and verify that the complete application works together.
