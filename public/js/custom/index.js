import regeneratorRuntime, { async } from "regenerator-runtime";

import { login, logout } from "./login";

import { createCategory, deleteCategory } from "./category";
import { createOrUpdateProduct, deleteProduct } from "./products";
import { createOrUpdateCustomer } from "./customers";
import { createBranch, addProductsToBranch } from "./branch";
import {
  data,
  getProductResults,
  getCustomerResults,
  orderDetails,
  completeOrder,
  updateOrder,
} from "./order";
import { renderDeliveryHtml, renderDiscountHtml, cart } from "./cart";

import { addToRefundCart, refund, createRefund } from "./refund";

const loginForm = document.querySelector(".loginForm");
const logoutBtn = document.querySelector(".logout");

const categoryForm = document.querySelector(".categoryForm");
const deleteCategoryBtn = document.querySelector(".deleteCategory");

const confirmDeleteProductBtns = document.querySelectorAll(".confirmDelete");
const productForms = document.querySelectorAll(".productForm");
const customerForm = document.querySelector(".customerForm");
const branchForm = document.querySelector(".branchForm");
const addProductsForm = document.querySelector(".addProductsForm");
const orderForm = document.querySelector(".orderForm");
const orderUpdateForm = document.querySelector(".orderUpdateForm");

const refundForm = document.querySelector(".refundForm");
const refundCheckboxEls = document.querySelectorAll(".addToRefundCart");

export const productInputEl = document.getElementById("productInput");
const customerInputEl = document.getElementById("customerInput");
const deliveryInputEl = document.getElementById("deliveryFee");
const discountInputEl = document.getElementById("discount");

// Handler Functions
async function handleLogin(e) {
  e.preventDefault();
  await login(this);
}

async function handleLogout(e) {
  e.preventDefault();
  await logout(this);
}

async function handleCategoryForm(e) {
  e.preventDefault();
  await createCategory(this);
}

async function handleDeleteCategory(e) {
  e.preventDefault();
  await deleteCategory(e.target.dataset.id);
}

async function handleProductDelete(e) {
  e.preventDefault();
  await deleteProduct(e.target.dataset.id);
}

async function handleProductForms(e) {
  e.preventDefault();
  await createOrUpdateProduct(this);
}

async function handleCustomerForm(e) {
  e.preventDefault();
  await createOrUpdateCustomer(this);
}

async function handleBranchForm(e) {
  e.preventDefault();
  await createBranch(this);
}

async function handleAddProductsForm(e) {
  e.preventDefault();
  await addProductsToBranch(this);
}

function handleGetAllProductsAndCustomers(form) {
  const products = JSON.parse(form.dataset.products);
  const customers = JSON.parse(form.dataset.customers);

  data.products = products;
  data.customers = customers;
  orderDetails.user = form.dataset.user;

  orderDetails.branch = form.dataset.branch;
}

function handleProductInput() {
  getProductResults(this);
}

function handleCustomerInput() {
  getCustomerResults(this);
}

async function handleOrderForm(e) {
  e.preventDefault();
  await completeOrder(this);
}

async function handleOrderUpdateForm(e) {
  e.preventDefault();
  await updateOrder(this);
}

async function handleRefundForm(e) {
  e.preventDefault();
  await createRefund(this);
}

// Event Listeners
if (loginForm) loginForm.addEventListener("submit", handleLogin);

if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);

if (categoryForm) categoryForm.addEventListener("submit", handleCategoryForm);
if (deleteCategoryBtn)
  deleteCategoryBtn.addEventListener("click", handleDeleteCategory);

if (confirmDeleteProductBtns) {
  confirmDeleteProductBtns.forEach((btn) =>
    btn.addEventListener("click", handleProductDelete)
  );
}

if (productForms) {
  productForms.forEach((form) => {
    form.addEventListener("submit", handleProductForms);
  });
}

if (customerForm) customerForm.addEventListener("submit", handleCustomerForm);

if (branchForm) branchForm.addEventListener("submit", handleBranchForm);

if (addProductsForm)
  addProductsForm.addEventListener("submit", handleAddProductsForm);

if (orderForm) {
  handleGetAllProductsAndCustomers(orderForm);
  productInputEl.addEventListener("input", handleProductInput);
  customerInputEl.addEventListener("input", handleCustomerInput);
  deliveryInputEl.addEventListener("input", renderDeliveryHtml);
  discountInputEl.addEventListener("input", renderDiscountHtml);
  cart.renderTotal();
  orderForm.addEventListener("submit", handleOrderForm);
}

if (orderUpdateForm)
  orderUpdateForm.addEventListener("submit", handleOrderUpdateForm);

if (refundForm) {
  refund.renderTotal();
  refundCheckboxEls.forEach((el) =>
    el.addEventListener("click", addToRefundCart)
  );
  refundForm.addEventListener("submit", handleRefundForm);
}
