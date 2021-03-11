const factory = require("./handlerFactory");
const Product = require("../models/productModel");

const catchAsync = require("../utils/catchAsync");

// FACTORY CRUD

exports.createProduct = factory.createOne(Product);
exports.getAllProducts = factory.getAll(Product);
exports.getProduct = factory.getOne(Product);
exports.deleteProduct = factory.deleteOne(Product);
exports.updateProduct = factory.updateOne(Product);

exports.getSearchData = catchAsync(async (req, res, next) => {
  const { product } = req.query;

  const products = await Product.find({
    title: { $regex: new RegExp(`^${product}`, "i") },
  });

  res.status(200).json({
    status: "success",
    data: {
      results: products.length,
      products,
    },
  });
});

exports.updateMultipleProducts = catchAsync(async (req, res, next) => {
  // console.log(req.body);
  const products = req.body;
  const updatedProducts = [];

  products.forEach(async (product) => {
    const p = await Product.findByIdAndUpdate(
      product.id,
      {
        stockQuantity: product.stockQuantity,
      },
      { new: true }
    );
    updatedProducts.push(p);
    // console.log(p);
  });

  res.status(200).json({
    status: "success",
    message: "All Products Updated!",
    data: updatedProducts,
  });
  // const {products} = req.body;
});
