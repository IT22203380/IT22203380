const Goal = require("../models/Goal");

// @desc   Create a new financial goal
// @route  POST /api/goals
const createGoal = async (req, res) => {
  try {
    const { name, targetAmount, deadline } = req.body;

    const newGoal = new Goal({
      user: req.user.id,
      name,
      targetAmount,
      deadline,
    });

    await newGoal.save();
    res.status(201).json({ message: "Goal created successfully", goal: newGoal });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Get all financial goals for a user
// @route  GET /api/goals
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Update saved amount for a goal
// @route  PATCH /api/goals/:id
const updateSavedAmount = async (req, res) => {
  try {
    const { amount } = req.body;
    const goal = await Goal.findById(req.params.id);

    if (!goal) return res.status(404).json({ message: "Goal not found" });

    goal.savedAmount += amount;

    if (goal.savedAmount >= goal.targetAmount) {
      goal.isCompleted = true;
    }

    await goal.save();
    res.json({ message: "Saved amount updated", goal });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Delete a financial goal
// @route  DELETE /api/goals/:id
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) return res.status(404).json({ message: "Goal not found" });

    await goal.remove();
    res.json({ message: "Goal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createGoal, getGoals, updateSavedAmount, deleteGoal };
