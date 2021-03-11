import axios from "axios";

import { showAlert } from "./alerts";

const customer = {};
export const createOrUpdateCustomer = async (form) => {
  const id = form.dataset.id;
  console.log("Connected!");
  customer.name = form.name.value.trim();
  customer.phoneNumber = form.phoneNumber.value.trim();

  if (id) return await updateCustomer(customer, id);

  await createCustomer(customer);
};

const createCustomer = async (data) => {
  try {
    showAlert("success", "Creating Customer..");
    const res = await axios({
      method: "POST",
      url: "/api/v1/customers",
      data,
    });

    if (res.data.status === "success") {
      showAlert("success", "Customer Created!");
      window.location.href = `${window.location.origin}/admin/customers/${res.data.data.slug}`;
    }
  } catch (err) {
    showAlert("error", "Something Went Wrong");
    console.error(err);
  }
};

const updateCustomer = async (data, id) => {
  try {
    showAlert("success", "Updating Customer..");
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/customers/${id}`,
      data,
    });

    if (res.data.status === "success") {
      showAlert("success", "Customer Updated!");
      window.location.href = `${window.location.origin}/admin/customers/${res.data.data.slug}`;
    }
  } catch (err) {
    showAlert("error", "Something Went Wrong");
    console.error(err);
  }
};
