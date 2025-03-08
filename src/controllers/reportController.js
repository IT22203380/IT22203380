const Transaction = require("../models/Transaction");

// @desc   Get spending trends over time
// @route  GET /api/reports/spending-trends
const getSpendingTrends = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const transactions = await Transaction.aggregate([
      {
        $match: {
          user: req.user.id,
          type: "expense",
          date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: { $month: "$date" },
          totalSpent: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Get income vs. expenses summary
// @route  GET /api/reports/income-vs-expenses
const getIncomeVsExpenses = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const summary = await Transaction.aggregate([
      {
        $match: {
          user: req.user.id,
          date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: "$type",
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const income = summary.find((item) => item._id === "income")?.totalAmount || 0;
    const expenses = summary.find((item) => item._id === "expense")?.totalAmount || 0;

    res.json({ income, expenses, balance: income - expenses });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Get transactions filtered by category or tags
// @route  GET /api/reports/filter
const getFilteredTransactions = async (req, res) => {
  try {
    const { category, tags, startDate, endDate } = req.query;
    let filter = { user: req.user.id };

    if (category) filter.category = category;
    if (tags) filter.tags = { $in: tags.split(",") };
    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const transactions = await Transaction.find(filter);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getSpendingTrends, getIncomeVsExpenses, getFilteredTransactions };
