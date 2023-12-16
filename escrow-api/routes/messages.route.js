const express = require("express");
const { createMessage, showAllMessages } = require("../controllers/message");
const router = express.Router();

/**
 * @description lists all the transactions in the database
 * @route GET - /api/v1/transactions/list
 * @access PRIVATE - Admin
 * @returns [transactions]
 */

router.route("/send-message").post(createMessage);

router.route("/show-messages").get(showAllMessages);

module.exports = router;
