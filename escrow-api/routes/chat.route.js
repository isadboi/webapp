const express = require("express");
const { auth } = require("../middleware/auth");
const { getChats } = require("../controllers/chat");
const router = express.Router();

/**
 * @description Gets the chats of currently logged in user
 * @route GET - /api/v1/chats
 * @access PRIVATE - ALL except un-authenticated
 * @returns [transactions]
 */

router.route("/").get(auth, getChats);

module.exports = router;
