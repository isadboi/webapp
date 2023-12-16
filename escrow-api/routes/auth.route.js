const express = require("express");
const { register, login, updatePassword, forgotPassword, resetPassword } = require("../controllers/auth");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/updatepassword").patch(auth, updatePassword);
router.route("/forgotpassword").post(forgotPassword);
router.route("/reset/password/:resettoken").post(resetPassword);

module.exports = router;
