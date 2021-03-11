import axios from "axios";

export const createCategory = async (form) => {
  const category = {};
  category.title = form.title.value.trim();

  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/categories",
      data: category,
    });
    if (res.data.status === "success") {
      window.location.href = `${window.location.origin}/admin/categories/all`;
    }
  } catch (err) {
    console.error(err);
  }
};

export const deleteCategory = async (id) => {
  try {
    const res = await axios({
      method: "DELETE",
      url: `/api/v1/categories/${id}`,
    });
    if (res.status === 204) {
      window.location.href = `${window.location.origin}/admin/categories/all`;
    }
  } catch (err) {
    console.error(err);
  }
};
