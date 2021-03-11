const Customer = require("../models/customerModel");
// const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.createCustomer = factory.createOne(Customer);
exports.getCustomer = factory.getOne(Customer);
exports.getAllCustomers = factory.getAll(Customer);
exports.updateCustomer = factory.updateOne(Customer);
exports.deleteCustomer = factory.deleteOne(Customer);
