const Transaction = require("../models/Transaction");

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
};

module.exports = { createTransaction, getTransactions, getTransactionById, updateTransaction, deleteTransaction };
