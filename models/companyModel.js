const mongoose = require("mongoose");

const Branch = require("./branchModel");

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A company must have a name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "A company must have a description"],
    trim: true,
  },
  country: {
    type: String,
    required: [true, "A company must have a country"],
    trim: true,
  },
  location: String,
});

// Document Middleware
companySchema.pre("remove", async function (next) {
  await Branch.remove({ company: this._id }).exec();
  next();
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
