import axios from "axios";
import { async } from "regenerator-runtime";

import { showAlert } from "./alerts";
import { addToCart, cart } from "./cart";
import { productInputEl } from "./index";

export const data = {
  products: [],
  customers: [],
};

export const orderDetails = {
  products: [],
  customer: "",
  user: "",
  branch: "",
  totalAmount: 0,
  amountPaid: 0,
  type: "",
  discount: 0,
  deliveryFee: 0,
  subtotal: 0,
  // refund: {
  //   products: [],
  //   totalAmountRefunded: 0,
  //   user: "",
  // },
};

const productElContainer = document.querySelector(".productSearchResults");
const customerElContainer = document.querySelector(".customerSearchResults");
const customerNameEl = document.querySelector(".customerName");

export const clearFields = () => {
  productInputEl.value = "";
  productElContainer.innerHTML = "";
};

const insertProductEl = (product) => {
  const html = `<div class="input-group mb-3">
        
          <input class="form-control" type="text" value="${product.type.title} -- ${product.type.price} GHS" />
          <input
            class="products form-control"
            type="number"
            value="0"
            min="0"
            max="${product.stockQuantity}"
            data-id="${product.type.id}"
            data-price="${product.type.price}"
            data-title="${product.type.title}"
            data-curr-branch-stock="${product.stockQuantity}"
            data-curr-warehouse-stock="${product.type.stockQuantity}"
          />
        <div class="input-group-prepend">
          <div class="input-group-text">
            <input class="addToCart" type="checkbox" data-id="${product.type.id}" />
          </div>
        </div>
      </div>`;

  productElContainer.insertAdjacentHTML("afterbegin", html);
  const addToCartBtns = document.querySelectorAll(".addToCart");
  addToCartBtns.forEach((btn) => btn.addEventListener("click", addToCart));
};

const insertCustomerEl = (customer) => {
  const html = `<div class="list-group">
        <a class="customer list-group-item list-group-item-action" 
        href="#" data-id="${customer._id}" data-name="${customer.name}">
          ${customer.name}
        </a>
      </div>`;

  customerElContainer.insertAdjacentHTML("afterbegin", html);
};

export const getProductResults = (input) => {
  productElContainer.innerHTML = "";
  const { products } = data;

  if (input.value.trim() === "") return (productElContainer.innerHTML = "");

  const results = products.filter((product) => {
    const title = product.type.title.toLowerCase();

    return title.startsWith(input.value.trim().toLowerCase());
  });
  results.forEach((res) => insertProductEl(res));
};

export const getCustomerResults = (input) => {
  customerElContainer.innerHTML = "";
  const { customers } = data;

  if (input.value.trim() === "") return (customerElContainer.innerHTML = "");

  const results = customers.filter((customer) => {
    const name = customer.name.toLowerCase();
    return name.startsWith(input.value.trim().toLowerCase());
  });

  results.forEach((res) => insertCustomerEl(res));
  const customerEls = document.querySelectorAll(".customer");
  customerEls.forEach((el) =>
    el.addEventListener("click", function () {
      orderDetails.customer = this.dataset.id;
      customerNameEl.textContent = this.dataset.name;
      input.value = "";
      customerElContainer.innerHTML = "";
    })
  );
};

export const completeOrder = async (form) => {
  if (
    (form.orderType.value.toLowerCase() === "regular" &&
      +form.amountPaid.value.trim() !== cart.total) ||
    !orderDetails.customer ||
    cart.items.length === 0
  )
    return showAlert("error", "Something Went Wrong");

  orderDetails.products = cart.items.map((item) => {
    const product = {};
    product.type = item.id;
    product.orderQuantity = item.quantity;
    product.purchasePrice = item.price;
    return product;
  });
  orderDetails.totalAmount = cart.total;
  orderDetails.amountPaid = +form.amountPaid.value.trim();
  orderDetails.type = form.orderType.value.toLowerCase();
  orderDetails.deliveryFee = cart.deliveryFee;
  orderDetails.subtotal = cart.subtotal;
  orderDetails.discount = cart.discount;
  // orderDetails.refund.user = orderDetails.user;
  // return console.log(orderDetails);

  return await createOrder(orderDetails);
};

const createOrder = async (data) => {
  showAlert("success", "Creating Order..");
  try {
    const res = await axios.post("/api/v1/orders", data);

    if (res.data.status === "success") {
      showAlert("success", "Order Created!");
      window.location.href = `${window.location.origin}/admin/orders/all`;
    }
  } catch (err) {
    console.error(err);
    showAlert("error", "Order Creation Aborted");
  }
};

export const updateOrder = async (form) => {
  // 1.  Update Customer's Debt amount
  // 2. Update Order's Amount Paid

  if (
    +form.payment.value.trim() > +form.dataset.amountOwed ||
    +form.payment.value.trim() === 0
  )
    return showAlert("error", "Enter a valid amount");

  const data = {};
  data.customerDebt = +form.dataset.customerDebt - +form.payment.value.trim();

  data.orderAmountPaid =
    +form.dataset.totalOrderPaid + +form.payment.value.trim();

  data.orderID = form.dataset.order;
  data.customer = form.dataset.customer;

  try {
    showAlert("success", "Updating Order");
    const res = await axios.patch(`/api/v1/orders/${data.orderID}`, data);

    if (res.data.status === "success") {
      showAlert("success", "Order Updated Successfully");
      window.location.href = `${window.location.origin}/admin/orders/all`;
    }
  } catch (err) {
    console.error(err);
    showAlert("error", "Something went wrong.");
  }
};
