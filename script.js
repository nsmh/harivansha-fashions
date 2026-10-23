/*
  harivansha FASHION & TAILORING
  Update the shop settings and sample products below before launch.
*/

const SHOP = {
  name: "harivansha Fashion & Tailoring",

  // Replace with your WhatsApp number, including country code.
  // India example: 9176975498 (no +, spaces or dashes).
  whatsapp: "9176975498",

  currency: "INR"
};

// Demonstration catalog. Replace with your real products and prices.
const products = [
  {
    id: 1,
    name: "Traditional Bangle Set",
    category: "Bangles",
    price: 249,
    tag: "Popular",
    description: "Colorful bangles for festive occasions.",
    image: "https://images.unsplash.com/photo-1610302843571-04b93198533b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Elegant Jewelry Set",
    category: "Bangles",
    price: 399,
    tag: "Featured",
    description: "A stylish accessory for special moments.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Fashion Earrings",
    category: "Fancy Items",
    price: 149,
    tag: "",
    description: "A lovely finishing touch to your outfit.",
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Decorative Hair Accessories",
    category: "Fancy Items",
    price: 99,
    tag: "New",
    description: "Pretty accessories for everyday styling.",
    image: "https://images.unsplash.com/photo-1599459166151-2244f2b9cfec?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    name: "Colorful Sewing Threads",
    category: "Tailoring",
    price: 120,
    tag: "",
    description: "A colorful selection for sewing projects.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "Lace & Dress Trims",
    category: "Dress Materials",
    price: 180,
    tag: "Popular",
    description: "Decorative trims for blouses and dresses.",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    name: "Blouse Embellishments",
    category: "Dress Materials",
    price: 199,
    tag: "",
    description: "Decorative details for custom blouse designs.",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    name: "Tailoring Essentials Kit",
    category: "Tailoring",
    price: 299,
    tag: "Featured",
    description: "Useful supplies for your tailoring projects.",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80"
  }
];

const cart = new Map();

const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const cartPanel = document.getElementById("cart-panel");
const cartBackdrop = document.getElementById("cart-backdrop");

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: SHOP.currency,
    maximumFractionDigits: 2
  }).format(amount);

function renderProducts() {
  const search = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;

  const filtered = products.filter((product) => {
    const matchesSearch =
      `${product.name} ${product.category} ${product.description}`
        .toLowerCase()
        .includes(search);

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  if (!filtered.length) {
    productGrid.innerHTML =
      '<p class="empty-cart">No products found. Try another search.</p>';
    return;
  }

  productGrid.innerHTML = filtered.map((product) => `
    <article class="product-card">
      <div class="product-image">
        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
          onerror="this.onerror=null;this.src='https://placehold.co/500x500/f8e8ed/8b2450?text=Product+Photo'"
        >
        ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-bottom">
          <span class="product-price">${money(product.price)}</span>
          <button class="add-button" data-add="${product.id}" type="button">
            + Add to cart
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

function addToCart(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;

  const existing = cart.get(id);
  cart.set(id, {
    product,
    quantity: existing ? existing.quantity + 1 : 1
  });

  renderCart();
  openCart();
}

function changeQuantity(id, change) {
  const item = cart.get(id);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart.delete(id);
  } else {
    cart.set(id, item);
  }

  renderCart();
}

function removeFromCart(id) {
  cart.delete(id);
  renderCart();
}

function getCartTotal() {
  let total = 0;

  for (const item of cart.values()) {
    total += item.product.price * item.quantity;
  }

  return total;
}

function renderCart() {
  const itemsContainer = document.getElementById("cart-items");
  const count = [...cart.values()].reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  document.getElementById("cart-count").textContent = count;
  document.getElementById("cart-total").textContent = money(getCartTotal());

  if (cart.size === 0) {
    itemsContainer.innerHTML =
      '<p class="empty-cart">Your cart is empty. Find something lovely!</p>';
    return;
  }

  itemsContainer.innerHTML = [...cart.values()].map(({ product, quantity }) => `
    <div class="cart-item">
      <div>
        <h3>${product.name}</h3>
        <p>${money(product.price)} each</p>
        <div class="quantity-controls">
          <button type="button" data-change="${product.id}" data-delta="-1"
            aria-label="Decrease ${product.name} quantity">−</button>
          <span>${quantity}</span>
          <button type="button" data-change="${product.id}" data-delta="1"
            aria-label="Increase ${product.name} quantity">+</button>
        </div>
      </div>
      <div>
        <strong>${money(product.price * quantity)}</strong><br>
        <button class="remove-button" type="button"
          data-remove="${product.id}">Remove</button>
      </div>
    </div>
  `).join("");
}

function openCart() {
  cartPanel.hidden = false;
  cartBackdrop.hidden = false;
  document.body.style.overflow = "hidden";
  document.getElementById("cart-close").focus();
}

function closeCart() {
  cartPanel.hidden = true;
  cartBackdrop.hidden = true;
  document.body.style.overflow = "";
}

function orderOnWhatsApp() {
  if (cart.size === 0) {
    alert("Please add at least one product to your cart.");
    return;
  }

  if (!/^\d{10,15}$/.test(SHOP.whatsapp)) {
    alert("Please configure your shop's WhatsApp number in script.js.");
    return;
  }

  const lines = [...cart.values()].map(({ product, quantity }) =>
    `${product.name} x ${quantity} = ${money(product.price * quantity)}`
  );

  const message = [
    `Hello ${SHOP.name}! I would like to place an order:`,
    "",
    ...lines,
    "",
    `Total: ${money(getCartTotal())}`,
    "",
    "Please confirm availability, delivery charges and payment options.",
    "My name and delivery address:"
  ].join("\n");

  const url =
    `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank", "noopener,noreferrer");
}

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});

document.getElementById("cart-items").addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-change]");
  const removeButton = event.target.closest("[data-remove]");

  if (quantityButton) {
    changeQuantity(
      Number(quantityButton.dataset.change),
      Number(quantityButton.dataset.delta)
    );
  }

  if (removeButton) {
    removeFromCart(Number(removeButton.dataset.remove));
  }
});

searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);

document.querySelectorAll("[data-category]").forEach((button) => {
  button.addEventListener("click", () => {
    categoryFilter.value = button.dataset.category;
    renderProducts();
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
  });
});

document.getElementById("cart-toggle").addEventListener("click", openCart);
document.getElementById("cart-close").addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !cartPanel.hidden) closeCart();
});

document.getElementById("checkout-button").addEventListener(
  "click",
  orderOnWhatsApp
);

document.getElementById("contact-whatsapp").addEventListener("click", (event) => {
  event.preventDefault();

  if (!/^\d{10,15}$/.test(SHOP.whatsapp)) {
    alert("Please configure your shop's WhatsApp number in script.js.");
    return;
  }

  const message = `Hello ${SHOP.name}! I would like to enquire about your products.`;

  window.open(
    `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener,noreferrer"
  );
});

document.getElementById("year").textContent = new Date().getFullYear();

renderProducts();
renderCart();
