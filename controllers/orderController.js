const factory = require("./handlerFactory");
const Order = require("../models/orderModel");
const Branch = require("../models/branchModel");
const Customer = require("../models/customerModel");
const catchAsync = require("../utils/catchAsync");

// exports.createOrder = factory.createOne(Order);
exports.getAllOrders = factory.getAll(Order);
exports.getOrder = factory.getOne(Order);
exports.deleteOrder = factory.deleteOne(Order);
// exports.updateOrder = factory.updateOne(Order);

exports.createOrder = catchAsync(async (req, res, next) => {
  // Update the stock quantities of purchased products in the branch
  const branch = await Branch.findOne({ _id: req.body.branch });

  const orderedProducts = req.body.products;
  const branchProducts = branch.products;

  const updatedProducts = branchProducts.map((product) => {
    //   Find an ordred product whose id === curr branch product
    const orderedProduct = orderedProducts.find(
      (p) => p.type === product.type.id
    );
    // Update the stock quantity
    if (orderedProduct) product.stockQuantity -= orderedProduct.orderQuantity;

    return product;
  });

  //   UPDATE THE BRANCH
  await Branch.findByIdAndUpdate(req.body.branch, {
    products: updatedProducts,
  });

  //   If Order type is credit, updated the customer's amount owed
  if (req.body.type === "credit") {
    const customer = await Customer.findById(req.body.customer);
    customer.amountOwed += req.body.totalAmount - req.body.amountPaid;

    // Update the customer
    await Customer.findByIdAndUpdate(req.body.customer, customer);
  }

  //   Create the order
  const order = await Order.create(req.body);

  res.status(201).json({
    status: "success",
    data: order,
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const data = req.body;
  // Update customer's amountOwed
  await Customer.findByIdAndUpdate(data.customer, {
    amountOwed: data.customerDebt,
  });

  //  Update order's amountPaid
  const order = await Order.findByIdAndUpdate(
    data.orderID,
    {
      amountPaid: data.orderAmountPaid,
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: order,
  });
});
