const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

// @desc   Create a budget
// @route  POST /api/budgets
const createBudget = async (req, res) => {
  try {
    const { amount, category, month, year, notificationsEnabled } = req.body;

    if (!amount || !month || !year) {
      return res.status(400).json({ message: "Amount, month, and year are required" });
    }

    // Ensure only one budget per category per month
    const existingBudget = await Budget.findOne({ user: req.user.id, category, month, year });

    if (existingBudget) {
      return res.status(400).json({ message: "Budget for this category and month already exists" });
    }

    const budget = await Budget.create({
      user: req.user.id,
      amount,
      category,
      month,
      year,
      notificationsEnabled,
    });

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Get all budgets for a user
// @route  GET /api/budgets
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Update a budget
// @route  PUT /api/budgets/:id
const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget || budget.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Budget not found" });
    }

    const updatedBudget = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBudget);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Delete a budget
// @route  DELETE /api/budgets/:id
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget || budget.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Budget not found" });
    }

    await budget.deleteOne();
    res.json({ message: "Budget deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Check budget status and notify user
// @route  GET /api/budgets/check/:month/:year
const checkBudgetStatus = async (req, res) => {
  try {
    const { month, year } = req.params;

    // Get user budgets for the selected month/year
    const budgets = await Budget.find({ user: req.user.id, month, year });

    if (!budgets.length) {
      return res.status(404).json({ message: "No budgets found for this period" });
    }

    let budgetStatus = [];

    for (let budget of budgets) {
      const totalSpent = await Transaction.aggregate([
        { $match: { user: req.user.id, category: budget.category, type: "expense" } },
        {
          $group: { _id: null, total: { $sum: "$amount" } },
        },
      ]);

      const spentAmount = totalSpent.length > 0 ? totalSpent[0].total : 0;
      const percentageUsed = ((spentAmount / budget.amount) * 100).toFixed(2);

      budgetStatus.push({
        category: budget.category,
        budgetAmount: budget.amount,
        spentAmount,
        percentageUsed,
        status: spentAmount >= budget.amount ? "Exceeded" : "Within Budget",
      });
    }

    res.json(budgetStatus);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createBudget, getBudgets, updateBudget, deleteBudget, checkBudgetStatus };
