const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A category must have a title"],
      unique: true,
      trim: true,
    },

    slug: String,
    description: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

categorySchema.virtual("products", {
  ref: "Product",
  foreignField: "category",
  localField: "_id",
});

///////////////////////////////////////////////////////////// DOCUMENT MIDDLEWARE

categorySchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
