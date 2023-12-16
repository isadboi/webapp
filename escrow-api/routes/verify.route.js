const { verifyUser } = require("../controllers/verify");
const catchAsyncError = require("../utils/catchAsyncError");

const router = require("express").Router();

/**
 * @description verifies the user
 * @route GET - /api/v1/verify
 * @access PUBLIC
 * @returns REDIRECTS TO LOGIN PAGE
 */

router.get("/", catchAsyncError(verifyUser));

module.exports = router;
