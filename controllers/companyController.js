const Company = require("../models/companyModel");

// const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.createCompany = factory.createOne(Company);
exports.getCompany = factory.getOne(Company);
exports.getAllCompanies = factory.getAll(Company);
exports.updateCompany = factory.updateOne(Company);
exports.deleteCompany = factory.deleteOne(Company);
