const express = require("express");
const {
  getSpendingTrends,
  getIncomeVsExpenses,
  getFilteredTransactions,
} = require("../controllers/reportController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/spending-trends", protect, getSpendingTrends);
router.get("/income-vs-expenses", protect, getIncomeVsExpenses);
router.get("/filter", protect, getFilteredTransactions);

module.exports = router;

