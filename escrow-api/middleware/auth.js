const catchAsync = require("../utils/catchAsyncError");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");

//User Authenticate
module.exports.auth = catchAsync(async (req, res, next) => {
  const token = req.headers["x-auth-token"];
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (user) {
      const loggedInUser = await User.findById(user.id);

      req.user = loggedInUser;
      next();
    }
  } catch (err) {
    if (err.message == "jwt expired") {
      return next(new ErrorHandler("Session Expired!", StatusCodes.UNAUTHORIZED));
    }

    return next(new ErrorHandler("Unauthoized!", StatusCodes.UNAUTHORIZED));
  }
});

//Admin Authenticate
module.exports.adminAuth = catchAsync(async (req, res, next) => {
  const token = req.headers["x-auth-token"];

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (user && user.role == "admin") {
      const loggedInUser = await User.findById(user.id);
      req.user = loggedInUser;
      next();
    }
  } catch (err) {
    if (err.message == "jwt expired") {
      return next(new ErrorHandler("Unauthoized!", StatusCodes.UNAUTHORIZED));
    }

    return next(new ErrorHandler("Unauthoized!", StatusCodes.UNAUTHORIZED));
  }
});
