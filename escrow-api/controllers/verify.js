const User = require("../models/User.js");
const ErrorHandler = require("../utils/errorHandler.js");
const { createHash } = require("crypto");

module.exports.verifyUser = async (req, res, next) => {
  const id = req.query.id;
  const token = createHash("sha256").update(id).digest("hex");
  const user = await User.findOne({ mailToken: token });
  if (!user) {
    throw next(new ErrorHandler(400, "Token Expired or is Invalid!"));
  }
  user.mailToken = "";
  user.verified = true;
  user.verifiedDate = Date.now();
  await user.save();
  return res.redirect(`URL`);
};
