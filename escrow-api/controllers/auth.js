const User = require("../models/User");
const ErrorHandler = require("../utils/errorHandler");
const catchAsync = require("../utils/catchAsyncError");
const { StatusCodes } = require("http-status-codes");
const { createToken } = require("../utils/jwtToken");
const validator = require("email-validator");
const crypto = require("crypto");
const transporter = require("../config/mailServer");
const ForgotPassword = require("../config/mailTemplates/ForgotPassword");
const EmailConfirm = require("../config/mailTemplates/EmailComfirm");

module.exports.register = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const validateEmail = validator.validate(email);
  if (!validateEmail) {
    return next(new ErrorHandler("Invalid Email format", StatusCodes.NOT_ACCEPTABLE));
  }

  const user = new User(req.body);
  const token = user.getMailToken();
  const verificationLink = `${req.protocol}://${req.get("host")}/api/v1/verify?id=${token}`;

  const mailOpts = EmailConfirm(user.email, user.name, verificationLink);

  await transporter.sendMail(mailOpts);
  await user.save();

  res.status(200).send("An email has been sent to your email address");
});

module.exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please fill in all details", StatusCodes.NO_CONTENT));
  }

  const validateEmail = validator.validate(email);
  if (!validateEmail) {
    return next(new ErrorHandler("Invalid Email format", StatusCodes.NOT_ACCEPTABLE));
  }

  const user = await User.findOne({
    email: req.body.email,
  }).select("+password");

  if (!user) {
    return next(new ErrorHandler("User doesn't exists", StatusCodes.NOT_FOUND));
  }

  if (!user.verified) {
    return next(new ErrorHandler("User not Verified, Please verify your email", StatusCodes.BAD_REQUEST));
  }

  const userPassword = await user.comparePassword(password);

  if (!userPassword) {
    return next(new ErrorHandler("Invalid email or password", StatusCodes.NOT_FOUND));
  }
  createToken(user, res);
});

//Update User Passowrd
module.exports.updatePassword = catchAsync(async (req, res, next) => {
  const { newPassword, confirmPassword, oldPassword } = req.body;
  if (!oldPassword || !newPassword || !confirmPassword) {
    return next(new ErrorHandler("Please fill in all details", StatusCodes.NO_CONTENT));
  }

  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler("New Password and Old Password Doesn't Match"));
  }

  const user = res.user;

  const matchPassword = await user.comparePassword(oldPassword);

  if (!matchPassword) {
    return next(new ErrorHandler("Old Password doesn't match", StatusCodes.UNAUTHORIZED));
  }
  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({
    user,
  });
});

module.exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const validateEmail = validator.validate(email);
  if (!validateEmail) {
    return next(new ErrorHandler("Invalid Email format", StatusCodes.NOT_ACCEPTABLE));
  }

  const user = await User.findOne({ email });

  if (!user || !user.verified) {
    return next(new ErrorHandler("No User with this email exists or user isn't verified"));
  }

  const resetToken = user.getMailToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get("host")}/auth/reset-password/${resetToken}`;

  // const message = `Your Password Reset Token is :- \n\n ${resetPasswordUrl} \n\n if you have not requesed this email, then please ignore it`;
  // const options = {
  //   email,
  //   message,
  //   Subject: "Password Reset ",
  // };

  try {
    const mailOptions = ForgotPassword(email, user.name, resetPasswordUrl);

    await transporter.sendMail(mailOptions);
    res.status(StatusCodes.OK).json({
      message: "Reset Token sent successfully",
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, StatusCodes.INTERNAL_SERVER_ERROR));
  }
});

module.exports.resetPassword = catchAsync(async (req, res, next) => {
  const { newPassword, confirmPassword } = req.body;

  if (!newPassword || !confirmPassword) {
    return next(new ErrorHandler("Please fill All credentials", StatusCodes.NOT_FOUND));
  }

  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler("New Password and confirm Password Doesnt Match", StatusCodes.BAD_REQUEST));
  }

  const resetToken = crypto.createHash("sha256").update(req.params.resettoken).digest("hex");

  const user = await User.findOne({ resetPasswordToken: resetToken }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Reset Password Token is Invalid or has been Expired", StatusCodes.NOT_FOUND));
  }

  user.password = newPassword;
  user.verified = true;
  await user.save();
  res.status(200).send("Password successfully changed!");
});
