const { StatusCodes } = require("http-status-codes");
const Chat = require("../models/Chat");

module.exports.getChats = async (req, res, next) => {
  const chats = await Chat.find({ users: { $in: [req.user.id] } });

  res.status(StatusCodes.OK).send(chats);
};
