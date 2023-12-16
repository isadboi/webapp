const router = require("express").Router();
const messagesRoute = require("./messages.route");
const transactionRoute = require("./transaction.route");
const authRoute = require("./auth.route");
const verifyRoute = require("./verify.route");
const chatRoute = require("./chat.route");
const userRoute = require("./user.route");

router.use("/messages", messagesRoute);
router.use("/transaction", transactionRoute);
router.use("/auth", authRoute);
router.use("/verify", verifyRoute);
router.use("/chats", chatRoute);
router.use("/user", userRoute);

module.exports = router;
