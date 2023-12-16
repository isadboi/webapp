const express = require("express");
const { register } = require("../controllers/auth");
const { auth, adminAuth } = require("../middleware/auth");
const { updateUser, getUser, getAllUsers } = require("../controllers/user");
const catchAsyncError = require("../utils/catchAsyncError");
const router = express.Router();

router.get("/", auth, catchAsyncError(getUser));
router.post("/", auth, catchAsyncError(updateUser));

router.get("/get-all-users", adminAuth, catchAsyncError(getAllUsers));

module.exports = router;
