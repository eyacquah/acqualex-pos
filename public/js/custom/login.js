import axios from "axios";

export const login = async (form) => {
  try {
    const email = form.email.value;
    const password = form.password.value;

    const res = await axios({
      method: "POST",
      url: "/api/v1/users/login",
      data: {
        email,
        password,
      },
    });

    console.log(res);
    if (res.data.status === "success") {
      location.assign("/admin");
    }
  } catch (err) {
    console.error(err);
  }
};

export const logout = async () => {
  try {
    const res = await axios.get("/api/v1/users/logout");

    if (res.data.status === "success") {
      window.location.href = window.location.href;
    }
  } catch (err) {
    console.error(err);
  }
};
