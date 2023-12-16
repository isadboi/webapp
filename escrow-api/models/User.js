const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    unique: false,
  },
  bio: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Please enter your Email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please Enter your password"],
    minLength: [true, "Password should be greater than 8 characters"],
    select: false,
  },
  role: {
    type: String,
    enum: ["normal", "admin"],
    default: "normal",
  },
  verified: {
    type: Boolean,
    default: false,
  },

  verifiedDate: {
    type: Date,
  },
  adminChat: {
    type: Boolean,
    default: false,
  },
  mailToken: String,
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getMailToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  //Hashing and Adding Reset Password Token To User Schema

  this.mailToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
