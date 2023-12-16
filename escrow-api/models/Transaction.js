const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    product: {
      type: String,
      required: [true, "Enter product name"],
    },
    price: {
      type: Number,
      required: [true, "Enter product price"],
    },
    buyerEmail: {
      type: String,
      required: [true, "Enter Email"],
    },
    paymentMethod: {
      type: String,
      required: [true, "Enter payment method"],
    },
    status: {
      type: String,
      enum: ["pending", "waiting for payment", "payment sent", "account info secured", "completed"],
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
