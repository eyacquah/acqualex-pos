const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  products: [
    {
      type: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: [true, "An order must have at least one product"],
      },
      orderQuantity: {
        type: Number,
        required: [true, "An ordered product must have a quantity"],
      },
      purchasePrice: {
        type: Number,
        required: [true, "An ordered product must have a purchase price"],
      },
    },
  ],
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: "Customer",
    required: [true, "An order must belong to a customer"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "An order must be created by a user"],
  },
  branch: {
    type: mongoose.Schema.ObjectId,
    ref: "Branch",
    required: [true, "An order must belong to a branch"],
  },
  totalAmount: {
    type: Number,
    required: [true, "An order must have a total amount"],
  },
  amountPaid: {
    type: Number,
    default: this.totalAmount,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  type: {
    type: String,
    enum: ["credit", "regular"],
    default: "regular",
  },
  deliveryFee: {
    type: Number,
    default: 0,
  },
  subtotal: {
    type: Number,
    default: this.totalAmount - this.deliveryFee,
  },
  discount: Number,
  orderNum: String,
  date: String,
  refund: {
    products: [
      {
        type: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: [true, "A refund must have at least one product"],
        },
        quantity: {
          type: Number,
          required: [true, "An ordered product must have a quantity"],
        },
        amountRefunded: Number,
      },
    ],
    totalAmountRefunded: Number,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A refund must be created by a user"],
    },
  },
  notes: [
    {
      text: String,
      by: String,
      createdAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});

orderSchema.pre(/^find/, function (next) {
  this.populate("customer")
    .populate({
      path: "user",
      select: "-branch -email -phoneNumber -photo -role -__v",
    })
    .populate({
      path: "products.type",
      select: "title price priceDiscount",
    });
  next();
});

///////////////////////////////////////////////////////
////// DOCUMENT MIDDLEWARE

orderSchema.pre("save", function (next) {
  // Create Order Number
  let id = this._id;
  id = `${id}`;

  this.orderNum = `GH-${id.slice(-5).toUpperCase()}`;

  // Create Human Readable Date
  const date = new Date(Date.parse(this.createdAt));
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  this.date = date.toLocaleString("en-GB", options);

  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
