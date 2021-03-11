const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "A user must have an email address"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Enter a valid email"],
    },
    phoneNumber: {
      type: String,
      required: [true, "A user must have a phone number"],
      validate: [validator.isMobilePhone, "Enter a valid phone number"],
    },
    photo: {
      type: String,
      default: "default.jpg",
    },
    role: {
      type: String,
      enum: ["sales", "manager", "admin"],
      default: "sales",
    },
    branch: {
      type: mongoose.Schema.ObjectId,
      ref: "Branch",
      required: [true, "A user must belong to a branch"],
    },
    password: {
      type: String,
      required: [true, "A user must have a password"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "A user must have a password"],
      validate: {
        validator: function (str) {
          // Only works on SAVE!!
          return str === this.password;
        },
        message: "The two passwords should match!",
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// QUERY MIDDLEWARE
userSchema.pre(/^find/, async function (next) {
  this.populate({
    path: "branch",
    // select: "name",
  });
  next();
});

//////////////////////////////////////
// DOCUMENT MIDDLEWARE

// Password hashing
userSchema.pre("save", async function (next) {
  // Only run func if the password was modified
  if (!this.isModified("password")) return next();

  // Hash password with cost of 12 -- CPU power
  this.password = await bcrypt.hash(this.password, 12);

  // Delete the password confirm field
  this.passwordConfirm = undefined;
  next();
});

// Setting password change date
userSchema.pre("save", function (next) {
  // Only run func if the password was modified
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 2000;
  next();
});

/////////////////////////////////////////////
// QUERY MIDDLEWARE

// Filtering all queries to select only active users
userSchema.pre(/^find/, function (next) {
  // THIS points to the current query
  this.find({ active: { $ne: false } });
  next();
});

///////////////////////////////////////////////////
//  SCHEMA METHODS

// Check if Password is correct
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Check if password changed after JWT was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp; // 100 < 200
  }

  return false;
};

// Create Password Reset Token
userSchema.methods.createPasswordResetToken = function () {
  // Create the token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Encrypt Token and save in DB
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Token expires in 10 mins
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // Return unencrypted token to be sent to user's email
  return resetToken;
};

// Create User Model
const User = mongoose.model("User", userSchema);

module.exports = User;
