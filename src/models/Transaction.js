const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "USD" }, // Default to USD
    exchangeRate: { type: Number, required: true, default: 1 }, // Default 1 for USD
    convertedAmount: { type: Number, required: true }, // Amount converted to default currency
    category: { type: String, required: true }, // E.g., Food, Rent, Salary
    tags: { type: [String], default: [] }, // E.g., ["#vacation", "#utilities"]
    description: { type: String },
    date: { type: Date, default: Date.now },
    isRecurring: { type: Boolean, default: false },
    recurrencePattern: { type: String, enum: ["daily", "weekly", "monthly"], default: null },
    endDate: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
