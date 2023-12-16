const User = require("../models/User");

module.exports.getUser = async (req, res) => {
  const user = await User.findById(req.user.id).lean();

  res.json(user);
};
module.exports.updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body);

  res.json("Successfully updated user");
};

module.exports.getAllUsers = async (req, res) => {
  const users = await User.find({ role: { $ne: "admin" } }).lean();

  res.json(users);
};
