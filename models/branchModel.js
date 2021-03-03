const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A branch must have a name"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "A branch must have a location"],
      trim: true,
    },
    company: {
      type: mongoose.Schema.ObjectId,
      ref: "Company",
      required: [true, "A branch must belong to a company"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Query Middleware
branchSchema.pre(/^find/, async function (next) {
  this.populate({
    path: "company",
    select: "name location",
  });
  next();
});

const Branch = mongoose.model("Branch", branchSchema);

module.exports = Branch;
