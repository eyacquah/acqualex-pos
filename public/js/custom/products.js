import axios from "axios";

import { showAlert } from "./alerts";

const productForm = {};

export const createOrUpdateProduct = async (form) => {
  const productId = form.dataset.id;

  const visibility =
    form.visibility.selectedOptions[0].dataset.bool === "yes" ? true : false;

  productForm.title = form.title.value;

  productForm.price = form.price.value;
  productForm.stockQuantity = form.stockQuantity.value;
  productForm.category = form.categories.selectedOptions[0].dataset.id;
  productForm.isVisible = visibility;

  if (productId) return await updateProduct(productForm, productId);

  return await createProduct(productForm);
};

const updateProduct = async (data, id) => {
  try {
    showAlert("success", "Product Updating...");

    const res = await axios({
      method: "PATCH",
      url: `/api/v1/products/${id}`,
      data: data,
    });

    if (res.data.status === "success") {
      showAlert("success", "Product Updated!");
      window.location.href = `${window.location.origin}/admin/products/${res.data.data.slug}`;
    }
  } catch (err) {
    showAlert("error", "Something Went Wrong");
    console.error(err);
  }
};

const createProduct = async (data) => {
  try {
    showAlert("success", "Creating Product..");
    const res = await axios({
      method: "POST",
      url: "/api/v1/products",
      data,
    });

    if (res.data.status === "success") {
      showAlert("success", "Product Created!");
      window.location.href = `${window.location.origin}/admin/products/${res.data.data.slug}`;
    }
  } catch (err) {
    showAlert("error", "Something Went Wrong");
    console.error(err);
  }
};

export const deleteProduct = async (id) => {
  try {
    showAlert("success", "Deleting Product..");
    const res = await axios({
      method: "DELETE",
      url: `/api/v1/products/${id}`,
    });
    if (res.status === 204) {
      showAlert("success", "Product Deleted!");

      window.location.href = `${window.location.origin}/admin/categories/all`;
    }
  } catch (err) {
    showAlert("error", "Something Went Wrong");
    console.error(err);
  }
};
