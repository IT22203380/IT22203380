const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true }, // Total budget amount
    category: { type: String, default: "All" }, // Specific category or all expenses
    month: { type: Number, required: true }, // 1-12 (January - December)
    year: { type: Number, required: true },
    notificationsEnabled: { type: Boolean, default: true }, // Notify when nearing the limit
  },
  { timestamps: true }
);

module.exports = mongoose.model("Budget", BudgetSchema);
