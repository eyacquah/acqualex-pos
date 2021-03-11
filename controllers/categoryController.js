const factory = require("./handlerFactory");

const Category = require("../models/categoryModel");

// FACTORY CRUD
exports.createCategory = factory.createOne(Category);
exports.getAllCategories = factory.getAll(Category);
exports.getCategory = factory.getOne(Category, { path: "products" });
exports.updateCategory = factory.updateOne(Category);
exports.deleteCategory = factory.deleteOne(Category);
