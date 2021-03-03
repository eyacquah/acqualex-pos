const crypto = require("crypto");
const { promisify } = require("util");

const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Email = require("../utils/email");

////////////////////////////////////////

// JSON WEB TOKEN

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  };

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

///////////////////////////////////////////

// SIGNUP

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    role: req.body.role,
    branch: req.body.branch,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });
  const url = `${req.protocol}://${req.get("host")}/me`;

  await new Email(newUser, url).sendWelcome();
  //   console.log(newUser);
  createSendToken(newUser, 201, req, res);
});

/////////////////////////////////////////

/// LOGIN

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if email and password was recieved
  if (!email || !password) {
    return next(new AppError("Please provide your email and password", 400));
  }

  // 2. Check if user exists and password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  // 3. All good? Send token to client
  createSendToken(user, 200, req, res);
});

// ///// LOGOUT
exports.logout = (req, res) => {
  res.cookie("jwt", "logout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

////////////////////////////////////////////

/// ALLOW ACCESS TO ONLY LOGGED IN USERS

exports.protect = catchAsync(async (req, res, next) => {
  // Check if token exists
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token)
    return next(
      new AppError("You are not logged in. Please login to get access", 401)
    );

  // Verify the token
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // Check if user still exists
  const currentUser = await User.findById(decodedToken.id);
  if (!currentUser) return next(new AppError("User no longer exists", 401));

  // Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decodedToken.iat))
    return next(
      new AppError("User recently changed password. Please login again", 401)
    );

  // Grant Access to protected route
  req.user = currentUser;
  // Pug gets access to res.locals
  res.locals.user = currentUser;
  next();
});

///////////////////////////////////////////////

//// RESTRICT ACCESS TO USERS WITH CERTAIN ROLES

exports.restrictTo = (...roles) => (req, _, next) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new AppError("You do not have the permission to perform this task", 403)
    );
  }
  next();
};

/////////////////////////////////////////////////

///  USER FORGETS THE PASSWORD

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1. Get User Email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new AppError("Could'nt find a user with that email address", 404)
    );
  }
  // 2. Generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3. Send token to user's email
  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();
    // await new Email(newUser, url).sendWelcome();

    res.status(200).json({
      status: "success",
      message: "Token successfully sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    // console.error(err);

    return next(
      new AppError("There was an error sending the mail. Try again later", 500)
    );
  }
});

//////////////////////////////////////////////////

/// USER RESETS PASSWORD

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1. Get the user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2. If user && token is valid, set the new password
  if (!user)
    return next(new AppError("Invalid or Expired Token. Try again", 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3. Update passwordChangedAt props

  // 4. Log the user in. --> Send JWT
  createSendToken(user, 200, req, res);
});

////////////////////////////////////////////////

//// LOGGED IN USER UPDATES PASSWORD

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body.data;

  // 1. Check if all fields were recieved
  if (!currentPassword || !newPassword || !confirmPassword) {
    return next(new AppError("Please provide your password", 400));
  }

  // 2. Get user
  const user = await User.findById(req.user.id).select("+password");

  //  3. Check if password is valid
  if (!user || !(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError("Invalid password", 401));
  }

  // 4. If so, update password
  user.password = newPassword;
  user.passwordConfirm = confirmPassword;
  await user.save();

  // 5. Log user in, send JWT
  createSendToken(user, 200, req, res);
});

// ///////////////////////////////////////////////////
//// CHECK IF USER IS LOGGED IN, FOR RENDERED PAGES ONLY
// NO ERRORS!

exports.isLoggedIn = async (req, res, next) => {
  // Check if token exists

  if (req.cookies.jwt) {
    try {
      // Verify the token
      const decodedToken = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // Check if user still exists
      const currentUser = await User.findById(decodedToken.id);
      if (!currentUser) return next();

      // Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decodedToken.iat)) return next();

      // THERE IS A LOGGED IN USER
      // Pug gets access to res.locals
      res.locals.user = currentUser;
      return next();
    } catch (error) {
      return next();
    }
  }
  next();
};
