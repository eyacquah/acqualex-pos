const mongoose = require("mongoose");
const slugify = require("slugify");

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A branch must have a name"],
      trim: true,
    },
    slug: String,
    products: [
      {
        type: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        stockQuantity: Number,
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Document Middleware
branchSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

branchSchema.pre(/^find/, function (next) {
  this.populate({
    path: "products.type",
    select: "title price stockQuantity",
  });
  next();
});

const Branch = mongoose.model("Branch", branchSchema);

module.exports = Branch;
