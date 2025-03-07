const express = require("express");
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").post(protect, createTransaction).get(protect, getTransactions);
router.route("/:id").get(protect, getTransactionById).put(protect, updateTransaction).delete(protect, deleteTransaction);

module.exports = router;
