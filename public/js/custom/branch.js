import { async } from "regenerator-runtime";
import axios from "axios";
import { showAlert } from "./alerts";

export const createBranch = async (form) => {
  const branch = {};
  branch.name = form.name.value.trim();

  return await createNewBranch(branch);
};

const createNewBranch = async (data) => {
  try {
    showAlert("success", "Creating Branch..");
    const res = await axios({
      method: "POST",
      url: "/api/v1/branches",
      data,
    });

    if (res.data.status === "success") {
      showAlert("success", "Branch Created!");
      //   window.location.href = `${window.location.origin}/admin/branches/${res.data.data.slug}`;
      window.location.href = `${window.location.origin}/admin/branches/all`;
    }
  } catch (err) {
    showAlert("error", "Something Went Wrong");
    console.error(err);
  }
};

export const addProductsToBranch = async (form) => {
  const branch = {
    products: [],
  };

  const warehouseProducts = [];

  // For Products Already In Branch

  const branchProductEls = document.querySelectorAll(".branchProducts");
  branchProductEls.forEach((el) => {
    // 1. Grab the data
    const productID = el.dataset.id;
    const branchStock = +el.dataset.currBranchStock;
    const warehouseStock = +el.dataset.currWarehouseStock;
    const supplyQuantity = +el.value.trim();

    const newBranchStock = branchStock + supplyQuantity;
    const newWarehouseStock = warehouseStock - supplyQuantity;

    // 2. Update Branch
    const product = {
      type: "",
      stockQuantity: 0,
    };

    product.type = productID;
    product.stockQuantity = newBranchStock;

    branch.products.push(product);

    // 3. Update EACH product
    const warehouseProduct = {
      id: "",
      stockQuantity: 0,
    };

    warehouseProduct.id = productID;
    warehouseProduct.stockQuantity = newWarehouseStock;

    warehouseProducts.push(warehouseProduct);
  });

  // For Products About to be added to the Branch

  const checkedProductIds = [];
  const checkboxEls = document.querySelectorAll(".checkbox");

  checkboxEls.forEach((el) => {
    el.checked ? checkedProductIds.unshift(el.dataset.id) : "";
  });

  const otherProductEls = document.querySelectorAll(".otherProducts");
  otherProductEls.forEach((el) => {
    if (!checkedProductIds.includes(el.dataset.id)) return;

    // GRAB THE DATA
    const productID = el.dataset.id;
    const warehouseStock = +el.dataset.currWarehouseStock;
    const supplyQuantity = +el.value.trim();
    const newWarehouseStock = warehouseStock - supplyQuantity;

    // UPDATE BRANCH
    const product = {
      type: "",
      stockQuantity: 0,
    };

    product.type = el.dataset.id;
    product.stockQuantity = +el.value.trim();

    branch.products.push(product);

    // UPDATE WAREHOUSE
    const warehouseProduct = {
      id: "",
      stockQuantity: 0,
    };

    warehouseProduct.id = productID;
    warehouseProduct.stockQuantity = newWarehouseStock;

    warehouseProducts.push(warehouseProduct);
  });

  if (warehouseProducts.length > 0) await updateManyProducts(warehouseProducts);

  if (branch.products.length > 0)
    return await updateBranch(branch, form.dataset.id);
};

const updateBranch = async (data, id) => {
  try {
    showAlert("success", "Branch Updating...");

    const res = await axios({
      method: "PATCH",
      url: `/api/v1/branches/${id}`,
      data,
    });

    if (res.data.status === "success") {
      showAlert("success", "Branch Updated!");

      window.location.href = `${window.location.origin}/admin/branches/${res.data.data.slug}`;
    }
  } catch (err) {
    showAlert("error", "Something Went Wrong");
    console.error(err);
  }
};

const updateManyProducts = async (arr) => {
  try {
    showAlert("success", "Products Updating...");

    const res = await axios({
      method: "PATCH",
      url: `/api/v1/products/update-many`,
      data: arr,
    });

    if (res.data.status === "success") {
      showAlert("success", "Products Updated!");
      return;
      // window.location.href = `${window.location.origin}/admin/products/${res.data.data.slug}`;
    }
  } catch (err) {
    showAlert("error", "Something Went Wrong");
    console.error(err);
  }
};
