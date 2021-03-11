import { clearFields } from "./order";

const cartTotalEl = document.querySelector(".cartTotal");
const numOfItemsEl = document.querySelector(".numOfItems");

export const cart = {
  itemIds: [],
  items: [],
  numOfItems: 0,
  subtotal: 0,
  deliveryFee: 0,
  discount: 0,
  total: 0,
  renderTotal: function () {
    this.total = this.subtotal + this.deliveryFee - this.discount;
    cartTotalEl.textContent = `GHS ${this.total}`;
    numOfItemsEl.textContent = this.numOfItems;
  },
};

const cartItemsContainer = document.querySelector(".cartItemsContainer");
const deliveryFeeContainer = document.querySelector(".deliveryFeeContainer");
const discountContainer = document.querySelector(".discountContainer");

const renderCartHtml = () => {
  cartItemsContainer.innerHTML = "";
  let numOfItems = 0;
  let total = 0;

  cart.items.forEach((item) => {
    const html = `<li class="list-group-item d-flex justify-content-between lh-condensed">
      <div>
        <h6 class="my-0">${item.title} x${item.quantity}</h6>
      </div>
      <span class="text-muted">GHS ${item.subtotal}</span>
    </li>`;

    cartItemsContainer.insertAdjacentHTML("afterbegin", html);

    // Calc subtotal
    total += item.subtotal;
    numOfItems += item.quantity;
  });
  cart.numOfItems = numOfItems;
  cart.subtotal = total;
  cart.renderTotal();
};

export function renderDeliveryHtml() {
  clearFields();
  deliveryFeeContainer.innerHTML = "";
  if (+this.value.trim() === 0) {
    cart.deliveryFee = +this.value;
    return cart.renderTotal();
  }

  const html = `<li class="list-group-item d-flex justify-content-between lh-condensed">
      <div>
        <h6 class="my-0">Delivery Fee</h6>
      </div>
      <span class="text-muted">GHS ${this.value}</span>
    </li>`;

  deliveryFeeContainer.insertAdjacentHTML("afterbegin", html);
  cart.deliveryFee = +this.value;
  cart.renderTotal();
}

export function renderDiscountHtml() {
  clearFields();
  discountContainer.innerHTML = "";
  if (+this.value.trim() === 0) {
    cart.discount = +this.value;
    return cart.renderTotal();
  }

  const html = ` <li class="list-group-item d-flex justify-content-between bg-light">
          <div class="text-success">
            <h6 class="my-0">Discount</h6>
            <span class="text-success"> -GHS ${this.value}</span>
          </div>
        </li>`;

  discountContainer.insertAdjacentHTML("afterbegin", html);
  cart.discount = +this.value;
  cart.renderTotal();
}

export function addToCart() {
  if (!this.checked) {
    cart.itemIds.pop(this.dataset.id);
    const item = cart.items.find((item) => item.id === this.dataset.id);
    if (item) cart.items.pop(item);
    renderCartHtml();
    return;
  }

  cart.itemIds.unshift(this.dataset.id);

  const productEls = document.querySelectorAll(".products");
  productEls.forEach((el) => {
    setCartItems(el);
    el.addEventListener("input", function () {
      setCartItems(this);
    });
  });

  // console.log(cart.items);
}

function setCartItems(el) {
  // If it hasn't been selected or the quantity is 0, return
  if (!cart.itemIds.includes(el.dataset.id)) return;
  if (+el.value === 0) return;

  // If item is already in the cart, increase the quantity
  const existingItem = cart.items.find((item) => item.id === el.dataset.id);

  if (existingItem) {
    existingItem.quantity = +el.value.trim();
    existingItem.price = +el.dataset.price;
    existingItem.subtotal = existingItem.quantity * existingItem.price;
    renderCartHtml();
    return;
  }

  const item = {
    id: "",
    title: "",
    quantity: 0,
    price: 0,
    subtotal: 0,
  };

  item.id = el.dataset.id;
  item.title = el.dataset.title;
  item.quantity = +el.value.trim();
  item.price = +el.dataset.price;
  item.subtotal = item.quantity * item.price;

  cart.items.push(item);
  renderCartHtml();
}
