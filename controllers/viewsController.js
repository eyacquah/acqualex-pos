const { promisify } = require("util");
const jwt = require("jsonwebtoken");

// Models
const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const Customer = require("../models/customerModel");
const Branch = require("../models/branchModel");
const Order = require("../models/orderModel");

const catchAsync = require("../utils/catchAsync");

exports.getLoginTemplate = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) throw new Error("Login");

    const decodedToken = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decodedToken.id);

    res.locals.user = user;
    // console.log();
    const categories = await Category.find();
    res.locals.categories = categories;

    return next();
  } catch (err) {
    res.status(200).render("login", {
      title: "Login",
    });
  }
};

exports.getIndex = catchAsync(async (req, res, next) => {
  let date = new Date(Date.now());
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  date = date.toLocaleString("en-GB", options);
  // console.log(date);

  const orders = await Order.find({ date: date });

  let total = 0;
  let totalRefunds = 0;

  orders.forEach((order) => {
    total += order.totalAmount;
    totalRefunds += order.refund.totalAmountRefunded
      ? order.refund.totalAmountRefunded
      : 0;
  });

  res.status(200).render("index", {
    title: "Company Name",
    orders,
    total,
    totalRefunds,
  });
});

exports.getCategoryList = catchAsync(async (req, res, next) => {
  res.status(200).render("category-list");
});

exports.getCategoryForm = (req, res, next) => {
  res.status(200).render("category-form");
};

exports.confirmDeleteCategory = catchAsync(async (req, res, next) => {
  const catArr = await Category.find({ slug: req.params.slug });
  const category = catArr[0];

  res.status(200).render("delete-category", {
    category,
  });
});

exports.getProductList = catchAsync(async (req, res, next) => {
  const products = await Product.find({ category: req.params.id });

  res.status(200).render("product-list", {
    products,
  });
});

exports.confirmDeleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.slug });

  res.status(200).render("delete-product", {
    product,
  });
});

exports.updateProductForm = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.slug });

  res.status(200).render("update-product", {
    product,
  });
});

exports.createProductForm = (req, res, next) => {
  res.status(200).render("create-product");
};

exports.getAllCustomers = catchAsync(async (req, res, next) => {
  const customers = await Customer.find();

  res.status(200).render("customer-list", {
    customers,
  });
});

exports.getCreateCustomerForm = (req, res, next) => {
  res.status(200).render("create-customer");
};

exports.getCustomerUpdateForm = catchAsync(async (req, res, next) => {
  const customer = await Customer.findOne({ slug: req.params.slug });

  res.status(200).render("update-customer", {
    customer,
  });
});

exports.getAllBranches = catchAsync(async (req, res, next) => {
  const branches = await Branch.find();

  res.status(200).render("branch-list", {
    branches,
  });
});

exports.getCreateBranchForm = (req, res, next) => {
  res.status(200).render("create-branch");
};

exports.getBranchDetail = catchAsync(async (req, res, next) => {
  const branch = await Branch.findOne({ slug: req.params.slug });

  res.status(200).render("branch-detail", {
    branch,
  });
});

exports.getBranchProductForm = catchAsync(async (req, res, next) => {
  const branch = await Branch.findOne({ slug: req.params.slug });
  const allProducts = await Product.find();

  const branchIds = branch.products.map((p) => `${p.type._id}`);

  const products = allProducts.map((product) => {
    product.checked = branchIds.includes(`${product._id}`);

    return product;
  });

  res.status(200).render("branch-product-form", {
    branch,
    products,
  });
});

// ORDERS
exports.getOrderForm = catchAsync(async (req, res, next) => {
  const customers = await Customer.find();

  res.status(200).render("create-order", {
    customers,
  });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find();
  orders.reverse();

  res.status(200).render("order-list", {
    orders,
  });
});

exports.getOrderInvoice = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  res.status(200).render("invoice", { order });
});

exports.getOrderDetail = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  res.status(200).render("order-update", { order });
});

exports.createRefund = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  res.status(200).render("create-refund", { order });
});
