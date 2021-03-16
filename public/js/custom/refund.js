import axios from "axios";
import { showAlert } from "./alerts";

const refundTotalEl = document.querySelector(".refundTotal");
const numOfItemsEl = document.querySelector(".numOfItems");
const refundItemsContainer = document.querySelector(".refundItemsContainer");

export const refund = {
  itemIds: [],
  items: [],
  numOfItems: 0,
  total: 0,
  renderTotal: function () {
    refundTotalEl.textContent = `GHS ${this.total}`;
    numOfItemsEl.textContent = this.numOfItems;
  },
};

const renderRefundCartHtml = () => {
  refundItemsContainer.innerHTML = "";
  let numOfItems = 0;
  let totalRefund = 0;

  refund.items.forEach((item) => {
    const html = `<li class="list-group-item d-flex justify-content-between lh-condensed">
      <div>
        <h6 class="my-0">${item.title} x${item.quantity}</h6>
      </div>
      <span class="text-muted">GHS ${item.subtotal}</span>
    </li>`;

    refundItemsContainer.insertAdjacentHTML("afterbegin", html);

    // Calc subtotal
    totalRefund += item.subtotal;
    numOfItems += item.quantity;
  });
  refund.numOfItems = numOfItems;
  refund.total = totalRefund;
  refund.renderTotal();
};

export function addToRefundCart() {
  if (!this.checked) {
    refund.itemIds.pop(this.dataset.id);
    const item = refund.items.find((item) => item.id === this.dataset.id);
    if (item) refund.items.pop(item);
    renderRefundCartHtml();
    return;
  }

  refund.itemIds.unshift(this.dataset.id);

  const productEls = document.querySelectorAll(".products");
  productEls.forEach((el) => {
    setRefundCartItems(el);
    el.addEventListener("input", function () {
      setRefundCartItems(this);
    });
  });
}

function setRefundCartItems(el) {
  // If it hasn't been selected or the quantity is 0, return
  if (!refund.itemIds.includes(el.dataset.id)) return;
  if (+el.value === 0) return;

  // If item is already in the refund, increase the quantity
  const existingItem = refund.items.find((item) => item.id === el.dataset.id);

  if (existingItem) {
    existingItem.quantity = +el.value.trim();
    existingItem.price = +el.dataset.price;
    existingItem.subtotal = existingItem.quantity * existingItem.price;
    renderRefundCartHtml();
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

  refund.items.push(item);
  renderRefundCartHtml();
}

// 1. Order ID
// 2. Products
// 3. User ID

export const createRefund = async (form) => {
  if (
    +form.totalRefund.value.trim() < 1 ||
    +form.totalRefund.value.trim() !== refund.total
  )
    return showAlert("error", "Enter A Valid Amount");

  const data = {
    refund: {
      products: [],
      totalAmountRefunded: 0,
      user: "",
    },
    branch: "",
    customer: "",
    type: "",
    amountPaid: 0,
    totalAmount: 0,
  };

  data.refund.products = refund.items.map((item) => {
    const product = {};
    product.type = item.id;
    product.quantity = item.quantity;
    product.amountRefunded = item.subtotal;

    return product;
  });

  data.refund.totalAmountRefunded = refund.total;
  data.refund.user = form.dataset.user;
  data.branch = form.dataset.branch;
  data.customer = form.dataset.customer;
  data.type = form.dataset.type;
  data.totalAmount = +form.dataset.totalAmount - refund.total;
  data.amountPaid =
    form.dataset.type !== "credit"
      ? +form.dataset.amountPaid - refund.total
      : +form.dataset.amountPaid;

  // console.log(data);

  try {
    showAlert("success", "Creating Refund");

    const res = await axios.patch(
      `/api/v1/orders/${form.dataset.order}/refund`,
      data
    );

    if (res.data.status === "success") {
      showAlert("success", "Refund Created Successfully");
      window.location.href = `${window.location.origin}/admin/orders/all`;
    }
  } catch (err) {
    console.error(err);
    showAlert("error", "Something Went Wrong");
  }
};
