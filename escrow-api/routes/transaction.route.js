const {
  getAllTransactions,
  createTransaction,
  changeStatus,
  getTransactionOfUser,
} = require("../controllers/transaction");
const { adminAuth, auth } = require("../middleware/auth");
const catchAsyncError = require("../utils/catchAsyncError");

const router = require("express").Router();

/**
 * @description lists all the transactions in the database
 * @route GET - /api/v1/transactions/list
 * @access PRIVATE - Admin MIDDLEWARE - NORMAL ROUTE
 * @returns [transactions]
 */

router.get("/", auth, catchAsyncError(getAllTransactions), catchAsyncError(getTransactionOfUser));

/**
 * @description creates the transactions
 * @route POST - /api/v1/transactions
 * @access PRIVATE - NORMAL
 * @returns Success Message
 */
router.post("/", auth, catchAsyncError(createTransaction));

/**
 * @description updates a transactions status
 * @route PUT - /api/v1/transactions/:trasactionId/status
 * @access PRIVATE - ADMIN
 * @returns Success Message
 */
router.put("/:trasactionId/status", adminAuth, catchAsyncError(changeStatus));

module.exports = router;
