const { StatusCodes } = require("http-status-codes");
const Transaction = require("../models/Transaction");

module.exports.createTransaction = async (req, res, next) => {
  const transaction = new Transaction(req.body);

  await transaction.save();

  res.status(200).send("");
};

module.exports.getTransactionOfUser = async (req, res, next) => {
  const transactions = await Transaction.find({ owner: req.user.id });

  return res.status(StatusCodes.OK).send(transactions);
};

module.exports.getAllTransactions = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next();
  }

  const transactions = await Transaction.find();

  return res.status(StatusCodes.OK).send(transactions);
};

module.exports.changeStatus = async (req, res, next) => {
  const transactions = await Transaction.findByIdAndUpdate(req.params.transactionId, { status: req.body.status });

  res.status(StatusCodes.OK).send(transactions);
};
