const Transaction = require("../models/Transaction");
const Goal = require("../models/Goal");

// @desc   Create a transaction
// @route  POST /api/transactions
const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, tags, description, date, isRecurring, recurrencePattern, endDate } = req.body;

    if (!type || !amount || !category) {
      return res.status(400).json({ message: "Type, amount, and category are required" });
    }

    const transaction = await Transaction.create({
      user: req.user.id,
      type,
      amount,
      category,
      tags,
      description,
      date,
      isRecurring,
      recurrencePattern,
      endDate,
    });

    // Allocate savings when type is "income"
    if (type === "income") {
      const goals = await Goal.find({ user: req.user.id, isCompleted: false });

      if (goals.length > 0) {
        const allocation = amount * 0.1; // Allocate 10% of income to savings
        const goal = goals[0]; // Allocate to the first active goal

        goal.savedAmount += allocation;

        if (goal.savedAmount >= goal.targetAmount) {
          goal.isCompleted = true;
        }

        await goal.save();
      }
    }

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Get all transactions for a user
// @route  GET /api/transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Get a single transaction by ID
// @route  GET /api/transactions/:id
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction || transaction.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Update a transaction
// @route  PUT /api/transactions/:id
const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction || transaction.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Delete a transaction
// @route  DELETE /api/transactions/:id
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction || transaction.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await transaction.deleteOne();
    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }

  const { getExchangeRate } = require("../utils/currencyUtils");

// Modify createTransaction function
const createTransaction = async (req, res) => {
  try {
    const { type, amount, currency, category, description, tags } = req.body;

    const exchangeRate = await getExchangeRate(currency);
    const convertedAmount = amount / exchangeRate; // Convert to USD

    const newTransaction = new Transaction({
      user: req.user.id,
      type,
      amount,
      currency,
      exchangeRate,
      convertedAmount,
      category,
      description,
      tags,
    });

    await newTransaction.save();
    res.status(201).json({ message: "Transaction added successfully", transaction: newTransaction });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

};

module.exports = { createTransaction, getTransactions, getTransactionById, updateTransaction, deleteTransaction };
