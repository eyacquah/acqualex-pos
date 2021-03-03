const Branch = require("../models/branchModel");

// const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.createBranch = factory.createOne(Branch);
exports.getBranch = factory.getOne(Branch);
exports.getAllBranches = factory.getAll(Branch);
exports.updateBranch = factory.updateOne(Branch);
exports.deleteBranch = factory.deleteOne(Branch);
