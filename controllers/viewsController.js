const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.getLoginTemplate = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) throw new Error("Login");

    const decodedToken = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );

    await User.findById(decodedToken.id);

    return next();
  } catch (err) {
    res.status(200).render("login", {
      title: "Login",
    });
  }
};

exports.getIndex = catchAsync(async (req, res, next) => {
  res.status(200).render("index", {
    title: "Company Name",
  });
});
