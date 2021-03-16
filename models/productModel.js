const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A product must have a title"],
      trim: true,
    },
    slug: String,
    price: {
      type: Number,
      required: [true, "A product must have a price"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      // select: false,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
    },
    stockQuantity: {
      type: Number,
      required: [true, "A product must have a stock quantity"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

///////////////////////////////////////////////////////
////// DOCUMENT MIDDLEWARE

productSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

//////////////////////////////////////////////////////////////// QUERY MIDDLEWARE

// Populate every Query with info on the category
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "title slug",
  });
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
