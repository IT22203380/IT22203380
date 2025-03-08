const express = require("express");
const {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
  checkBudgetStatus,
} = require("../controllers/budgetController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").post(protect, createBudget).get(protect, getBudgets);
router.route("/:id").put(protect, updateBudget).delete(protect, deleteBudget);
router.route("/check/:month/:year").get(protect, checkBudgetStatus);

module.exports = router;
