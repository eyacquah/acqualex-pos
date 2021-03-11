const mongoose = require("mongoose");
const validator = require("validator");
const slugify = require("slugify");

// name, email, pass, pass con, phone number,address

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
    unique: true,
    trim: true,
  },
  slug: String,
  phoneNumber: {
    type: String,
    required: [true, "A customer must have a phone number"],
    validate: [validator.isMobilePhone, "Enter a valid phone number"],
  },
  amountOwed: {
    type: Number,
    default: 0,
  },
});

///////////////////////////////////////////////////////
////// DOCUMENT MIDDLEWARE

customerSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
