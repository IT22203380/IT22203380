const express = require("express");
const { createGoal, getGoals, updateSavedAmount, deleteGoal } = require("../controllers/goalController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, createGoal);
router.get("/", protect, getGoals);
router.patch("/:id", protect, updateSavedAmount);
router.delete("/:id", protect, deleteGoal);

module.exports = router;
